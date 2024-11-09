import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddingAddress from "./AddressCheckout/AddingAddress";
import { useCreateNewOrderMutation } from "../redux/features/order/orderApi";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../redux/features/auth/authApi";
import LoadingTracking from "./LoadingTracking";
import ErrorInput from "./ErrorInput";
import OrderSuccessAlert from "./ClientAlert/OrderSuccessAlert";

function Checkout() {
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [changeAddrs, setChangeAddrs] = useState(false);
  const [transactionMethod, setTransactionMethod] = useState("To Ship");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Paypal");
  const [showOrderAlert, setShowOrderAlert] = useState(false);
  const [payLink, setPayLink] = useState(null);

  const navigate = useNavigate();
  const {
    data: userDetails,
    isLoading,
    error,
  } = useGetSingleUserQuery(user._id, {
    pollingInterval: 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [payment, setPayment] = useState(true);

  const [newOrder] = useCreateNewOrderMutation();
  const params = useParams();
  const { token } = params;
  const cartToken = localStorage.getItem("cartToken");

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
    if (token !== cartToken) {
      navigate("/");
    }
  }, [cartItems, navigate, token, cartToken]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    const savedTransactionMethod = sessionStorage.getItem("transactionMethod");

    if (userDetails && userDetails.address) {
      const defaultAddress =
        userDetails.address.find((addr) => addr.isDefault) ||
        userDetails.address[0];
      setSelectedAddress(JSON.parse(savedAddress) || defaultAddress);
    }

    setTransactionMethod(savedTransactionMethod || "To Ship");
  }, [userDetails]);

  const handleAddressChange = (addressId) => {
    const newAddress = userDetails.address.find(
      (addr) => addr._id === addressId
    );
    if (newAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(newAddress));
      setSelectedAddress(newAddress);
    }
    setChangeAddrs(false);
  };

  const handleTransactionMethodChange = (method) => {
    setTransactionMethod(method);
    sessionStorage.setItem("transactionMethod", method);
  };
  const handleInitiatePaypalPayment = async () => {
    const orderData = {
      userId: userDetails._id,
      cartItems: cartItems.map((singleCartItem) => ({
        productId: singleCartItem._id,
        title: singleCartItem.title,
        slug: singleCartItem.slug,
        image: singleCartItem.image[0].url,
        category: singleCartItem.category,
        price: singleCartItem.price,
        stock: singleCartItem.stocks,
        oldPrice: singleCartItem.oldPrice || null,
        quantity: singleCartItem.quantity,
        properties: singleCartItem.properties,
        remainingBalance: singleCartItem.remainingBalance,
      })),
      addressInfo: {
        name: selectedAddress.name,
        addressId: selectedAddress._id,
        street: selectedAddress.street,
        barangay: selectedAddress.barangay,
        province: selectedAddress.province,
        region: selectedAddress.region,
        city: selectedAddress.municipality,
        zipcode: selectedAddress.zipcode || null,
        phone: selectedAddress.phone,
      },
      paymentMethod: paymentMethod,
      totalAmount: cartItems
        .reduce((a, c) => a + c.price * c.quantity, 0)
        .toFixed(2),
      transactionMethod: transactionMethod,
    };

    try {
      const { message, approvalURL, myOrder } = await newOrder(
        orderData
      ).unwrap();
      setPayLink(approvalURL);
      if (message === "Successfully Order Place!") {
        setShowOrderAlert(true);
      }

      // window.location.href = approvalURL;

      sessionStorage.setItem("getOrder", JSON.stringify(myOrder));
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <>
      {showOrderAlert && <OrderSuccessAlert payLink={payLink} />}
      {changeAddrs && (
        <AddingAddress
          setChangeAddrs={setChangeAddrs}
          setSelectedAddress={setSelectedAddress}
          userDetails={userDetails}
          handleAddressChange={handleAddressChange}
          selectedAddress={selectedAddress}
        />
      )}
      <div className="container my-10 lg:grid lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-[30px] font-semibold">Shopping Cart</h1>
          <div className="flex-grow border-t border-gray-500 border-[1px] mb-5"></div>
          {cartItems.map((item, index) => (
            <div className="flex gap-5 mt-5" key={index}>
              <img
                src={item.image[0].url}
                alt=""
                className="w-[250px] h-[250px] border-black border-2 rounded-[20px]"
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{item.title}</h1>
                <h2 className="text-xl">{item.category}</h2>
                <h2 className="text-2xl font-semibold">
                  ₱
                  {item.price.toLocaleString(undefined, {
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
            Select Transaction Method
          </h1>
          <div className="flex-grow border-t border-gray-500 border-[1px] mb-5"></div>
          <div className="flex gap-8 items-center">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="productType"
                  className="hidden peer"
                  onChange={() => handleTransactionMethodChange("To Ship")}
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
                  onChange={() => handleTransactionMethodChange("To Pickup")}
                  checked={transactionMethod === "To Pickup"}
                />
                <span className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-transparent"></span>
                <span className="ml-2 text-gray-700 text-2xl">For Pickup</span>
              </label>
            </div>
          </div>
          {transactionMethod === "To Ship" && (
            <>
              <h1 className="text-3xl mt-10">Delivery Address</h1>
              {!selectedAddress ? (
                <div className="border-2 border-black p-2 rounded-[20px] mt-3">
                  <div className="flex gap-5 items-center">
                    <h1
                      className="ml-auto text-blue-400 underline cursor-pointer"
                      onClick={() => setChangeAddrs(true)}
                    >
                      Add Address
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-black p-2 rounded-[20px] mt-3">
                  <div className="flex gap-5 items-center">
                    <h1 className="text-xl font-semibold">
                      {selectedAddress?.name}
                    </h1>
                    <h1 className="text-xl font-semibold">
                      +{selectedAddress?.phone}
                    </h1>
                    <h1
                      className="ml-auto text-blue-400 underline cursor-pointer"
                      onClick={() => setChangeAddrs(true)}
                    >
                      Change
                    </h1>
                  </div>

                  <div className="flex gap-3 items-center">
                    {selectedAddress?.isDefault && (
                      <p className="bg-red-400 rounded-[20px] px-2 text-white">
                        Default
                      </p>
                    )}
                    <p className="text-lg">
                      {selectedAddress?.street}, {selectedAddress?.barangay},{" "}
                      {selectedAddress?.municipality},{" "}
                      {selectedAddress?.province}, {selectedAddress?.region}
                    </p>
                  </div>
                </div>
              )}

              <h1 className="text-3xl mt-10">Courier Service</h1>
              <div className="border-2 border-black p-2 rounded-[20px] mt-3">
                <h1 className="text-xl font-semibold">Courier</h1>
                <p className="text-red-500 text-lg">
                  *The courier service will depend on the Authentique Shop for
                  timely deliveries and accurate handling of shipments.”
                </p>
              </div>
              <h1 className="text-3xl mt-10">Delivery Fee</h1>
              <div className="border-2 border-black p-2 rounded-[20px] mt-3">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold">Shipping Fee </h1>
                  <h1 className="mr-5 text-lg">₱--.00</h1>
                </div>

                <p className="text-red-500 text-lg">
                  *Delivery fee may vary from Authentique Shop location to the
                  client’s location and will be shouldered by the buyer
                </p>
              </div>
            </>
          )}
          {transactionMethod === "To Pickup" && (
            <>
              <h1 className="text-3xl mt-10">Personal Details</h1>
              <div className="border-2 border-black p-2 rounded-[20px] mt-3">
                <div className="flex gap-5 items-center">
                  <h1 className="text-xl font-semibold">
                    {selectedAddress?.name}
                  </h1>
                  <h1 className="text-xl font-semibold">
                    +{selectedAddress?.phone}
                  </h1>
                  <h1
                    className="ml-auto text-blue-400 underline cursor-pointer"
                    onClick={() => setChangeAddrs(true)}
                  >
                    Change
                  </h1>
                </div>

                <div className="flex gap-3 items-center">
                  {selectedAddress?.isDefault && (
                    <p className="bg-red-400 rounded-[20px] px-2 text-white">
                      Default
                    </p>
                  )}
                  <p className="text-lg">
                    {selectedAddress?.street}, {selectedAddress?.barangay},{" "}
                    {selectedAddress?.municipality}, {selectedAddress?.province}
                    , {selectedAddress?.region}
                  </p>
                </div>
              </div>
              <h1 className="text-3xl mt-10">Pickup Location</h1>
              <div className="border-2 border-black p-2 rounded-[20px] mt-3">
                <h1 className="text-xl font-semibold">
                  Authentique Collectibles
                </h1>
                <p className="text-lg">
                  *1067 Manila-Cavite Rd, Santa Cruz, Cavite City, Cavite
                </p>
              </div>
            </>
          )}
          <h1 className="text-3xl mt-10">Payment Method</h1>
          <div
            className={`flex items-center space-x-4 border-2 hover:border-black p-2 py-6 rounded-[20px] mt-3 bg-blue-300 peer-checked:border-black w-[75%] ${
              payment ? `border-black` : `border-transparent`
            }`}
          >
            <label className="flex items-center ml-5">
              <input
                type="radio"
                name="Paypal"
                id="Paypal"
                value={paymentMethod}
                className="hidden peer"
                onChange={() => {
                  setPayment(true);
                  setPaymentMethod("Paypal");
                }}
                checked
                required
              ></input>
              <span className="w-10 h-10 bg-white rounded-full border border-black flex items-center justify-center peer-checked:bg-black peer-checked:border-white"></span>
              <img src="/images/paypal.png" alt="" className="w-10 ml-5" />
              <span className="text-4xl font-verdana font-bold italic text-blue-900">
                Pay
              </span>
              <span className="text-4xl font-verdana font-bold italic text-blue-500">
                Pal
              </span>
            </label>
          </div>
          <div className="flex justify-between items-center text-2xl font-semibold mt-10">
            <h1>
              Merchandise Subtotal{" "}
              {cartItems.reduce((a, c) => a + c.quantity, 0)} Item(s)
            </h1>
            <h1>
              ₱
              {cartItems
                .reduce((a, c) => a + c.price * c.quantity, 0)
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </h1>
          </div>
          <div className="flex justify-between items-center text-2xl font-semibold mt-5">
            <h1>Shipping Fee Subtotal</h1>
            <h1 className="text-base text-red-500">*Shouldered by the buyer</h1>
          </div>
          <div className="flex-grow border-t border-gray-500 border-[1px] my-5"></div>
          <div className="flex justify-between items-center text-2xl font-semibold mt-5">
            <h1>Total</h1>
            <h1>
              ₱
              {cartItems
                .reduce((a, c) => a + c.price * c.quantity, 0)
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </h1>
          </div>

          <div className="flex justify-center items-center my-10">
            <button
              className="border-black border-[1px] p-2 bg-[#a0a0a0] text-white font-bold text-3xl rounded-[10px] px-32"
              onClick={handleInitiatePaypalPayment}
            >
              Place order now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
