import React, { useState } from "react";
import {
  useCancelOrderMutation,
  useGetUserOrderQuery,
  usePayOrderMutation,
  usePayRemainingMutation,
} from "../redux/features/order/orderApi";
import { useSelector } from "react-redux";
import LoadingTracking from "../components/LoadingTracking";
import ErrorInput from "../components/ErrorInput";
import { useParams } from "react-router-dom";
import { BiFileBlank } from "react-icons/bi";
import CancelOrderAlert from "./ClientAlert/CancelOrderAlert";
import { toast } from "react-toastify";

function ToShipOrder() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: { orders = [] } = {},
    isLoading,
    error,
  } = useGetUserOrderQuery(user._id, {
    pollingInterval: 500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const { status } = useParams();
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = monthNames[dateObj.getMonth()]; // Get month name
    const year = dateObj.getFullYear();

    return `${month} ${day}, ${year}`; // Format: Month Day, Year
  };

  const [payRemaining] = usePayRemainingMutation();
  const [OrderPay] = usePayOrderMutation();
  const handleToPay = async (payOrder) => {
    try {
      const { approvalURL } = await OrderPay({
        orderId: payOrder._id,
      }).unwrap();
      window.location.href = approvalURL;
      sessionStorage.setItem("getOrder", JSON.stringify(payOrder));
    } catch (error) {
      console.log(error);
    }
  };
  const [cancelAlert, setCancelAlert] = useState(false);
  const [orderCancel, setOrderCancel] = useState("");
  const [cancelOrder] = useCancelOrderMutation();
  const handleShowAlert = (myOrder) => {
    setCancelAlert(true);
    setOrderCancel(myOrder);
  };

  const handleToCancelOrder = async (list) => {
    try {
      const response = await cancelOrder({
        orderId: list.orderId,
        cartItems: list.cartItems,
      }).unwrap();
      toast.success(response.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setCancelAlert(false);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to cancel the order";
      console.log(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-right",
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

  const handlePayRemaining = async (remaining) => {
    const remainingPay = remaining.cartItems
      .filter((item) => item.remainingBalance)
      .reduce((total, item) => total + item.remainingBalance, 0);
    const data = { remainingPayment: remainingPay };
    try {
      const { approvalURL } = await payRemaining(data).unwrap();
      window.location.href = approvalURL;
      sessionStorage.setItem(
        "RemainingPay",
        JSON.stringify({ remainingPay: remainingPay, orderId: remaining._id })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const normalText = status
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const filteredOrders = orders.filter((e) => e.orderStatus === normalText);
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      {cancelAlert && (
        <CancelOrderAlert
          setCancelAlert={setCancelAlert}
          orderCancel={orderCancel}
          handleToCancelOrder={handleToCancelOrder}
        />
      )}
      <div className="p-6  flex justify-center my-10">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-5">
          <h1 className="text-  2xl font-semibold border-b pb-2 mb-4">
            {normalText}
          </h1>
          {filteredOrders.length !== 0 ? (
            <>
              {filteredOrders.map((order, index) => (
                <div key={index}>
                  <div className="p-4 bg-secondary rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-semibold text-lg">
                        Authentique Collectibles &gt;
                      </h2>
                      <a href="#" className="text-blue-500 font-semibold">
                        Seller to Pack
                      </a>
                    </div>
                    <div className="p-3 border border-gray-400 rounded-lg bg-white mb-3">
                      <p className="text-sm font-semibold">
                        {order.orderStatus === "To Pay" && <span>Unpaid</span>}
                        {order.orderStatus === "To Receive" && (
                          <>
                            Get by{" "}
                            <span className="font-bold">
                              {formatDate(order.updatedAt) +
                                " - " +
                                formatDate(order.estimatedDate)}
                            </span>
                          </>
                        )}
                        {order.orderStatus === "Received" && (
                          <span className="font-bold">Order Completed</span>
                        )}
                        {order.orderStatus === "To Pickup" && (
                          <span>Get by anytime</span>
                        )}
                        {order.orderStatus === "To Ship" && (
                          <>
                            Get by{" "}
                            {order.cartItems?.filter((e) => e.properties?.eta)
                              ?.length > 0 ? (
                              <span className="font-bold">
                                {/* Get the latest (max) eta */}
                                {new Date(
                                  Math.max(
                                    ...order.cartItems
                                      .filter((e) => e.properties?.eta)
                                      .map((e) =>
                                        new Date(e.properties.eta).getTime()
                                      )
                                  )
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            ) : (
                              <span className="font-bold">
                                {formatDate(order.orderDate) +
                                  " - " +
                                  formatDate(order.estimatedDate)}
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mb-4">
                      <strong>NOTE:</strong> Dear valued client, we recommend
                      staying informed about the status of your order by
                      regularly checking for updates. This proactive approach
                      ensures transparency and allows for timely adjustments,
                      guaranteeing a smooth processing experience tailored to
                      your needs.
                    </p>
                    {order.cartItems.map((item, index) => (
                      <div className="flex gap-4 mb-2" key={index}>
                        <img
                          src={item.image}
                          alt="Product"
                          className="w-24 rounded-lg bg-white border-[1px] border-black"
                        />

                        <div>
                          <div
                            className="flex flex-col justify-between"
                            key={index}
                          >
                            <div>
                              <h3 className="text-lg font-semibold">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {item.category}
                              </p>
                              <p className=" font-semibold">
                                ₱
                                {item.price.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}{" "}
                                {/* <span className="text-xs">(Remaining Balance)</span> */}
                              </p>
                              <p className="text-sm">
                                Quantity: {item.quantity}
                              </p>
                              {item.remainingBalance > 0 && (
                                <p className="text-sm font-semibold text-red-500">
                                  Remaining Balance: ₱
                                  {item?.remainingBalance?.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* <div className="flex justify-between mb-2">
              <p className="font-semibold">Down payment:</p>
              <p>₱1,000.00</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="font-semibold">Full payment:</p>
              <p>₱3,000.00</p>
            </div> */}
                    <div className="flex justify-between border-t border-gray-400 pt-2 mt-2">
                      <p className="font-bold">
                        Merchandise Subtotal {order.cartItems.length} Item(s)
                      </p>
                      <p className="font-bold">
                        ₱
                        {order.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    {order.cartItems
                      .filter((item) => item.remainingBalance)
                      .reduce(
                        (total, item) => total + item.remainingBalance,
                        0
                      ) !== 0 &&
                      order.orderStatus === "To Ship" && (
                        <>
                          <div className="flex justify-between  pt-2 mt-2">
                            <p className="font-bold">
                              Total Remaining Balance:
                            </p>
                            <p className="font-bold">
                              ₱
                              {order.cartItems
                                .filter((item) => item.remainingBalance)
                                .reduce(
                                  (total, item) =>
                                    total + item.remainingBalance,
                                  0
                                )
                                .toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                            </p>
                          </div>
                        </>
                      )}

                    <div className="flex justify-between  pt-2 mt-2">
                      <p className="font-bold">
                        Total {order.cartItems.length} item(s):
                      </p>
                      <p className="font-bold">
                        ₱
                        {order.orderStatus === "To Ship"
                          ? (
                              order.totalAmount +
                              order.cartItems
                                .filter((item) => item.remainingBalance)
                                .reduce(
                                  (total, item) =>
                                    total + item.remainingBalance,
                                  0
                                )
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : order.totalAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </p>
                    </div>
                    {order.cartItems.some((item) => item.remainingBalance) &&
                      order.orderStatus === "To Ship" && (
                        <div className="flex justify-end my-3">
                          <button
                            className="border-black rounded-[5px] p-1 px-3 bg-primary text-white"
                            onClick={() => handlePayRemaining(order)}
                          >
                            Pay Remaining
                          </button>
                        </div>
                      )}
                    {order.orderStatus === "To Pay" && (
                      <div className="flex justify-end my-3 gap-3">
                        <button
                          className="rounded-[5px] p-1 px-3 bg-red-500 text-white"
                          onClick={() => handleShowAlert(order)}
                        >
                          Cancel Order
                        </button>
                        <button
                          className="border-black rounded-[5px] p-1 px-3 bg-primary text-white"
                          onClick={() => handleToPay(order)}
                        >
                          Pay Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center h-52 my-32 text-2xl">
              <div>
                <BiFileBlank className="text-[10vh]" />
                <h1>No Orders</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToShipOrder;
