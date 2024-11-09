import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCreateAddressMutation } from "../../redux/features/auth/authApi";
import { toast } from "react-toastify";
import { LuTrash } from "react-icons/lu";

function AddAdress({ setMyAddress, userDetails }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [street, setStreet] = useState();
  const [phoneNumber, setPhoneNumber] = useState();

  const [fullName, setFullName] = useState();

  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedBarangay, setSelectedBarangay] = useState();

  const [defaultAddress, setDefaultAddress] = useState();

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

  const [addNewAdress] = useCreateAddressMutation();

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
      const response = await addNewAdress({
        userId: userDetails._id,
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
      const errorMessage = error?.data?.message || "Failed to add address";
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
          <p>Add Address</p>
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
                className="mt-1 p-1 border border-gray-300 rounded-md w-full"
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="number"
                className="mt-1 p-1 border border-gray-300 rounded-md w-full"
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter you phone number"
                required
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
                required
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
                required
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
                required
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
                required
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
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Enter street, building, house no."
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              onChange={() => {
                setDefaultAddress((prev) => !prev);
              }}
            />
            <label htmlFor="">Set as Default Address</label>
          </div>
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => setMyAddress("shipping-address")}
              className="w-full bg-secondary text-white py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition duration-200"
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

export default AddAdress;
