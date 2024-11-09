import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from "../../redux/features/auth/authApi";
import { LuTrash } from "react-icons/lu";
import { toast } from "react-toastify";

function EditAddress({ setMyAddress, singleEdit, userDetails }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(singleEdit.region || "");
  const [selectedProvince, setSelectedProvince] = useState(
    singleEdit.province || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    singleEdit.municipality || ""
  );
  const [selectedBarangay, setSelectedBarangay] = useState(
    singleEdit.barangay || ""
  );

  const [street, setStreet] = useState(singleEdit.street || "");
  const [fullName, setFullName] = useState(singleEdit.name);
  const [phoneNumber, setPhoneNumber] = useState(singleEdit.phone);

  const [defaultAddress, setDefaultAddress] = useState(singleEdit.isDefault);

  useEffect(() => {
    axios
      .get("https://psgc.cloud/api/regions")
      .then((response) => setRegions(response.data));
  }, []);

  const handleRegionSelect = (region) => {
    const selected = regions.find((e) => e.code === region);
    setSelectedRegion(selected.name);
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
    setProvinces([]);
    setCities([]);
    setBarangays([]);

    axios
      .get(`https://psgc.cloud/api/regions/${region}/provinces`)
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  };
  const handleProvinceSelect = (province) => {
    const selected = provinces.find((e) => e.code === province);
    setSelectedProvince(selected.name);
    setSelectedCity("");
    setSelectedBarangay("");
    setCities([]);
    setBarangays([]);

    axios
      .get(`https://psgc.cloud/api/provinces/${province}/cities-municipalities`)
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  };

  const handleCitySelect = (city) => {
    const selected = cities.find((e) => e.code === city);
    setSelectedCity(selected.name);
    setSelectedBarangay("");
    setBarangays([]);

    axios
      .get(`https://psgc.cloud/api/cities-municipalities/${city}/barangays`)
      .then((response) => {
        setBarangays(response.data);
      })
      .catch((error) => {
        console.error("Error fetching barangays:", error);
      });
  };

  const handleBarangaySelect = (barangay) => {
    const selected = barangays.find((e) => e.code === barangay);
    setSelectedBarangay(selected.name);
  };

  //   useEffect(() => {
  //     if (selectedRegion) {
  //       axios
  //         .get(`https://psgc.cloud/api/regions/${selectedRegion}/provinces`)
  //         .then((response) => setProvinces(response.data))
  //         .catch((error) => console.error(error));
  //     } else {
  //       setProvinces([]);
  //       setCities([]);
  //       setBarangays([]);
  //     }
  //   }, [selectedRegion]);

  //   useEffect(() => {
  //     if (selectedProvince) {
  //       axios
  //         .get(
  //           `https://psgc.cloud/api/provinces/${selectedProvince}/cities-municipalities`
  //         )
  //         .then((response) => setCities(response.data))
  //         .catch((error) => console.error(error));
  //     } else {
  //       setCities([]);
  //       setBarangays([]);
  //     }
  //   }, [selectedProvince]);

  //   useEffect(() => {
  //     if (selectedCity) {
  //       axios
  //         .get(
  //           `https://psgc.cloud/api/cities-municipalities/${selectedCity}/barangays`
  //         )
  //         .then((response) => setBarangays(response.data))
  //         .catch((error) => console.error(error));
  //     } else {
  //       setBarangays([]);
  //     }
  //   }, [selectedCity]);

  const [updateAddress] = useUpdateAddressMutation();
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const addressInfo = {
      name: fullName,
      phone: phoneNumber,
      region: selectedRegion,
      province: selectedProvince,
      municipality: selectedCity,
      barangay: selectedBarangay,
      street: street,
      isDefault: defaultAddress,
    };

    try {
      const response = await updateAddress({
        userId: userDetails._id,
        addressId: singleEdit._id,
        addressInfo,
      }).unwrap();
      toast.success(response.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setMyAddress("shipping-address");
    } catch (error) {
      const errorMessage = error?.message || "Failed to update address";
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const [deleteAddress] = useDeleteAddressMutation();
  const handleDeleteAddress = async (addressId) => {
    const selectedAddress = localStorage.getItem("selectedAddress");
    const selectedId = JSON.parse(selectedAddress);
    try {
      const response = await deleteAddress({
        addressId,
        userId: userDetails._id,
      }).unwrap();
      toast.success(response.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if (selectedId._id === addressId) {
        localStorage.removeItem("selectedAddress");
      }
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to delete address";
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div>
      <div className="flex shrink-0 items-center pb-4 mx-5 text-xl font-medium text-slate-800">
        <div className="flex justify-between w-[500px] items-center ">
          <p>Edit Address</p>
          <LuTrash
            className="bg-red-500 text-3xl p-1 rounded-[10px] text-white"
            onClick={() => {
              handleDeleteAddress(singleEdit._id),
                setMyAddress("shipping-address");
            }}
          />
        </div>
      </div>
      <div className="relative border-t border-slate-300 py-4 mx-5 leading-normal text-slate-600 font-light">
        <form onSubmit={handleSubmitEdit}>
          <div className="flex gap-4 mb-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                className="mt-1 p-1 border border-gray-300 rounded-md w-full"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                className="mt-1 p-1 border border-gray-300 rounded-md w-full"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Region, Province, City, Barangay
            </label>
            <div className="grid gap-4">
              <select
                onChange={(e) => handleRegionSelect(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Region</option>
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => handleProvinceSelect(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Province</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => handleCitySelect(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">City/Municipality</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => handleBarangaySelect(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Barangay</option>
                {barangays.map((barangay) => (
                  <option key={barangay.code} value={barangay.code}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Street Name, Building, House No.
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Enter street, building, house no."
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              className={
                singleEdit.isDefault === true ? `cursor-not-allowed` : ""
              }
              checked={defaultAddress || singleEdit.isDefault}
              disabled={singleEdit.isDefault === true}
              onChange={() => {
                if (!singleEdit.isDefault) {
                  setDefaultAddress((prev) => !prev);
                }
              }}
            />
            <label htmlFor="">Set as Default Address</label>
          </div>
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setMyAddress("shipping-address")}
              className="w-full bg-secondary text-white py-2 rounded-lg font-semibold hover:bg-red-500 transition duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAddress;
