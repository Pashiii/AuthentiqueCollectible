import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchSingleOrderQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/features/order/orderApi";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";
import { toast } from "react-toastify";

function SingleOrder() {
  const { status, id } = useParams();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState("");
  const { data: order = [], isLoading, error } = useFetchSingleOrderQuery(id);
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}-${day}-${year}`;
  };
  const remainBal = order.cartItems?.filter((e) => e.remainingBalance || null);
  const totalRemainingBalance = remainBal?.reduce((sum, item) => {
    return sum + (item.remainingBalance || 0);
  }, 0);
  useEffect(() => {
    if (order.orderStatus) {
      setOrderStatus(order.orderStatus);
    }
  }, [order]);
  console.log(order);
  const [updateStatus] = useUpdateOrderStatusMutation();
  const handleUpdateStatus = async () => {
    try {
      const response = await updateStatus({
        orderId: id,
        orderStatus: orderStatus,
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
      console.log(response.order);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to update";
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
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <IoIosCloseCircle
          className="text-red-400 text-[50px] cursor-pointer"
          onClick={() => navigate(`/admin/orders/list/${status}`)}
        />
      </div>

      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className="my-10">
        <h1 className="text-xl">Customer's Information</h1>
        <div className="flex-grow border-t border-gray-500 border-[2px]"></div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex  justify-between items-center">
            <h1 className="text-xl font-bold ">Order ID :</h1>
            <span className="font-normal w-[80%]">{order._id}</span>
          </div>
          <div className="flex justify-between items-center ">
            <h1 className="text-xl font-bold">Customer's name : </h1>
            <span className="font-normal w-[80%]">
              {order.addressInfo.name}
            </span>
          </div>
          <div className="flex  justify-between items-center">
            <h1 className="text-xl font-bold">Customer's number : </h1>
            <span className="font-normal w-[80%]">
              +63{order.addressInfo.phone}
            </span>
          </div>
          <div className="flex  justify-between items-center">
            <h1 className="text-xl font-bold">Customer's address : </h1>
            <span className="font-normal w-[80%]">
              {order?.addressInfo?.street +
                ", " +
                order?.addressInfo?.barangay +
                ", " +
                order?.addressInfo?.city +
                ", " +
                order?.addressInfo?.province +
                ", " +
                order?.addressInfo?.region}
            </span>
          </div>
          <div className="flex  justify-between items-center">
            <h1 className="text-xl font-bold">Order Date : </h1>
            <span className="font-normal w-[80%]">
              {formatDate(order.orderDate)}
            </span>
          </div>
          <div className="flex  justify-between items-center">
            <h1 className="text-xl font-bold">Payment Method : </h1>
            <span className="font-normal w-[80%]">{order.paymentMethod}</span>
          </div>
          <div className="flex  justify-between items-center">
            <h1 className="text-xl font-bold">Payment ID : </h1>
            <span className="font-normal w-[80%]">{order.paymentId}</span>
          </div>
          <div className="flex  justify-between items-center">
            <h1 className="text-xl font-bold">Order Status : </h1>

            <div className="w-[80%]">
              <select
                className=" border border-black bg-secondary  rounded-[10px] px-5 w-[200px] py-2"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                {order.orderStatus === "To Pickup" ? (
                  <>
                    <option>To Pickup</option>
                    <option>Received</option>
                  </>
                ) : (
                  <>
                    <option value="" disabled>
                      Select Status...
                    </option>
                    <option>To Ship</option>
                    <option>To Receive</option>
                    <option>Received</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-xl">Order's Information</h1>
      <div className="flex-grow border-t border-gray-500 border-[2px]"></div>
      <div className="flex justify-center items-center pt-3">
        <table className="min-w-full bg-gray-200 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="py-2 px-4 border">Order No.</th>
              <th className="py-2 px-4 border">Prod. Image</th>
              <th className="py-2 px-4 border">Prod. Name</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Unit Price</th>
              <th className="py-2 px-4 border">Order Status</th>
              <th className="py-2 px-4 border">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {order.cartItems.map((ord, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } border-b`}
              >
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {index + 1}
                </td>
                <td className="py-4 px-4 border  flex justify-center items-center ">
                  <img
                    src={ord.image}
                    alt="Product"
                    className="w-[70px] h-[90px] object-cover border-black border-[1px] rounded-[10px]"
                  />
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {ord.title}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {ord.quantity}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {ord.price}
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  <h1 className="bg-green-700  py-1 rounded-[10px] text-white">
                    {order.orderStatus}
                  </h1>
                </td>
                <td className="py-2 px-4 border text-center font-semibold text-xl">
                  {ord.remainingBalance > 0 ||
                  order.paymentStatus === "Unpaid" ? (
                    <>
                      <h1 className="bg-red-500 mx-10 py-1 rounded-[10px] text-white">
                        Unpaid
                      </h1>
                    </>
                  ) : (
                    <h1 className="bg-green-700 mx-10 py-1 rounded-[10px] text-white">
                      {order.paymentStatus}
                    </h1>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1 className="text-xl mt-10">Order's Cost</h1>
      <div className="flex-grow border-t border-gray-500 border-[2px]"></div>
      <div className="flex justify-between m-10">
        <h1 className="text-3xl font-semibold">
          Mechandise Subtotal{" "}
          <span className="text-gray-300">
            {order.cartItems.length} Item(s)
          </span>
        </h1>
        <h1 className="text-3xl">
          ₱
          {order.totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h1>
      </div>
      {remainBal ? (
        <div className="flex justify-between m-10">
          <h1 className="text-3xl font-semibold">Remaining Balance </h1>
          <h1 className="text-3xl">
            ₱
            {totalRemainingBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      ) : (
        <></>
      )}

      <div className="flex justify-between mx-10 mb-10">
        <h1 className="text-3xl font-semibold">Shipping Fee Subtotal</h1>
        <h1 className="text-xl ">
          Note: Shipping isn't free and will be shouldered by the buyer
        </h1>
      </div>
      <div className="flex-grow border-t border-gray-500 border-[2px]"></div>
      <div className="flex justify-between mx-10 my-10">
        <h1 className="text-3xl font-semibold">
          Total<span className="text-gray-300">(VAT included)</span>
        </h1>
        <h1 className="text-3xl">
          ₱
          {(order.totalAmount + totalRemainingBalance).toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </h1>
      </div>
      <div className="flex justify-end m-10 gap-10 rounded-[10px]">
        <button className="text-white border-[1px] border-black bg-[#7b7b7b] p-3 w-[30vh] text-2xl font-bold rounded-[10px]">
          Cancel
        </button>
        <button
          className="text-white border-[1px] border-black bg-[#7b7b7b] p-3 w-[30vh] text-2xl font-bold rounded-[10px]"
          onClick={() => handleUpdateStatus()}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default SingleOrder;
