import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingTracking from "./LoadingTracking";
import ErrorInput from "./ErrorInput";
import { useSelector } from "react-redux";
import {
  useAuctionOrderingMutation,
  useFetchSingleOrderQuery,
} from "../redux/features/order/orderApi";

const AuctionCheckout = () => {
  const { orderId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const {
    data: orderAuction = [],
    isLoading,
    error,
  } = useFetchSingleOrderQuery(orderId);

  const [transactionMethod, setTransactionMethod] = useState("To Ship");
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [street, setStreet] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Paypal");

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

  const [auctionOrder] = useAuctionOrderingMutation();
  const handleSubmitAuction = async (e) => {
    e.preventDefault();
    const data = {
      userId: user._id,
      addressInfo: {
        name: fullName,
        street: street,
        barangay: selectedBarangay,
        province: selectedProvince,
        region: selectedRegion,
        city: selectedCity,
        phone: phoneNumber,
      },
      paymentMethod: paymentMethod,
      transactionMethod: transactionMethod,
      cartItems: orderAuction.cartItems,
      totalAmount: orderAuction.totalAmount,
    };
    try {
      const { approvalURL, myOrder } = await auctionOrder({
        orderId: orderId,
        auctionOrder: data,
      }).unwrap();
      window.location.href = approvalURL;
      sessionStorage.setItem("getOrder", JSON.stringify(myOrder));
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  };

  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;

  return (
    <div className="container my-10 lg:grid lg:grid-cols-2 gap-10">
      <div>
        <h1 className="text-[30px] font-semibold">Auction Item</h1>
        <div className="flex-grow border-t border-gray-500 border-[1px] mb-5"></div>
        {orderAuction.cartItems.map((item, index) => (
          <div className="flex gap-5 mt-5" key={index}>
            <img
              src={item.image}
              alt=""
              className="w-[250px] h-[250px] border-black border-2 rounded-[20px]"
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <h2 className="text-xl">{item.category}</h2>
              <h2 className="text-2xl font-semibold">
                ₱
                {orderAuction.totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
              <p>Quantity : {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h1 className="text-[30px] font-semibold">
          Fill up the billing address
        </h1>
        <div className="flex-grow border-t border-gray-500 border-[1px] mb-5"></div>

        <form onSubmit={handleSubmitAuction}>
          <div className="flex gap-8 items-center pb-5">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="productType"
                  className="hidden peer"
                  onChange={() => setTransactionMethod("To Ship")}
                  checked={transactionMethod === "To Ship"}
                />
                <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-transparent"></span>
                <span className="ml-2 text-gray-700 text-2xl">
                  For Delivery
                </span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="productType"
                  className="hidden peer"
                  onChange={() => setTransactionMethod("To Pickup")}
                  checked={transactionMethod === "To Pickup"}
                />
                <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-transparent"></span>
                <span className="ml-2 text-gray-700 text-2xl">For Pickup</span>
              </label>
            </div>
          </div>
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
                required
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
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Region, Province, City, Barangay
            </label>
            <div className="grid grid-cols-2 gap-4">
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
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Enter street, building, house no."
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <input
              type="text"
              value={paymentMethod}
              placeholder="Paypal"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md cursor-default outline-none"
              onChange={(e) => setPaymentMethod(e.target.value)}
              readOnly
            />
          </div>

          <div className="flex items-center gap-2">
            {transactionMethod === "To Ship" && (
              <div className="border-2 border-black p-2 rounded-[20px] mt-3 w-full">
                <h1 className="text-xl font-semibold">Courier</h1>
                <p className="text-red-500 text-base">
                  *The courier service will depend on the Authentique Shop for
                  timely deliveries and accurate handling of shipments.”
                </p>
              </div>
            )}
            {transactionMethod === "To Pickup" && (
              <div className="border-2 border-black p-2 rounded-[20px] mt-3 w-full">
                <h1 className="text-xl font-semibold">Pickup Location</h1>
                <p className="text-base font-semibold">
                  *Authentique Collectibles
                </p>
                <p className="text-red-500 text-base">
                  1067 Manila-Cavite Rd, Santa Cruz, Cavite City, Cavite
                </p>
              </div>
            )}
            <div className="border-2 border-black p-2 rounded-[20px] mt-3 w-full">
              <div className="flex justify-between">
                <h1 className="text-xl font-semibold">Shipping Fee </h1>
                <h1 className="mr-5 text-lg">₱--.00</h1>
              </div>

              <p className="text-red-500 text-base">
                *Delivery fee may vary from Authentique Shop location to the
                client’s location and will be shouldered by the buyer
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 py-10">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
            >
              Place order now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionCheckout;
