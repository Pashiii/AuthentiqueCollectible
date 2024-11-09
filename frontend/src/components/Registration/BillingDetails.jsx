import axios from "axios";
import React, { useEffect, useState } from "react";

function BillingDetails({
  setSelectedBarangay,
  selectedBarangay,
  setSelectedCity,
  selectedCity,
  setSelectedProvince,
  selectedProvince,
  setSelectedRegion,
  selectedRegion,
  setStreet,
  setPhoneNumber,
  setStep,
}) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
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

  const handleNextPage = (e) => {
    e.preventDefault();
    setStep("verification");
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Billing Information</h1>
      <div className="h-[3px] bg-white mt-5"></div>
      <p className="italic mb-3">Please Fill up the following </p>
      <form onSubmit={handleNextPage}>
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="block text-lg">Select Region:</h1>
            <select
              style={{ color: selectedRegion === "" ? "#b3b3b3" : "" }}
              onChange={(e) => handleRegionSelect(e.target.value)}
              className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
              required
            >
              <option value="">Region</option>
              {regions.map((region) => (
                <option
                  key={region.code}
                  value={region.code}
                  className="text-black"
                >
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h1 className="block text-lg">Select Province:</h1>
            <select
              style={{ color: selectedProvince === "" ? "#b3b3b3" : "" }}
              onChange={(e) => handleProvinceSelect(e.target.value)}
              className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
              required
            >
              <option value="">Province</option>
              {provinces.map((province) => (
                <option
                  key={province.code}
                  value={province.code}
                  className="text-black"
                >
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h1 className="block text-lg">Select City:</h1>
            <select
              style={{ color: selectedCity === "" ? "#b3b3b3" : "" }}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
              required
            >
              <option value="">City/Municipality</option>
              {cities.map((city) => (
                <option
                  key={city.code}
                  value={city.code}
                  className="text-black"
                >
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h1 className="block text-lg">Select Barangay:</h1>
            <select
              style={{ color: selectedBarangay === "" ? "#b3b3b3" : "" }}
              onChange={(e) => handleBarangaySelect(e.target.value)}
              className="bg-transparent border-white border-[1px] outline-none rounded-[10px] w-full p-2"
              required
            >
              <option value="">Barangay</option>
              {barangays.map((barangay) => (
                <option
                  key={barangay.code}
                  value={barangay.code}
                  className="text-black"
                >
                  {barangay.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg">
              Street / Building Name/Unit Floor:
            </label>
            <input
              type="text"
              placeholder="Enter your Street / Building Name/Unit Floor"
              className="bg-transparent border-white border-[1px] w-full p-2 rounded-lg "
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-lg">Phone Number:</label>
            <input
              type="text"
              placeholder="Enter your Street / Building Name/Unit Floor"
              className="bg-transparent border-white border-[1px] w-full p-2 rounded-lg "
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-center py-5 mx-auto">
          <button
            type="submit"
            className="w-full bg-white text-black p-2 rounded-lg hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default BillingDetails;
