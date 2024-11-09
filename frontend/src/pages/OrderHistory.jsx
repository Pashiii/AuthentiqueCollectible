import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosArrowForward, IoMdSettings } from "react-icons/io";
import { FaTruck, FaCheckCircle } from "react-icons/fa";
import { PiTrayArrowDownBold, PiTrayArrowUpBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetSingleUserQuery } from "../redux/features/auth/authApi";
import LoadingTracking from "../components/LoadingTracking";
import ErrorInput from "../components/ErrorInput";
import { useGetUserOrderQuery } from "../redux/features/order/orderApi";
import { MdOutlinePayment } from "react-icons/md";

function OrderHistory() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: userDetails = [],
    isLoading,
    error,
  } = useGetSingleUserQuery(user._id);

  const { data: { orders = [] } = {} } = useGetUserOrderQuery(user._id, {
    pollingInterval: 500,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div className="container min-h-screen max-h-full">
      <div className="flex justify-between items-center my-10 mx-5">
        <div className="flex items-center gap-2">
          <FaRegUserCircle className="text-7xl" />
          <h1 className="text-3xl font-bold">
            {userDetails.firstname.toUpperCase() +
              " " +
              userDetails.lastname.toUpperCase()}
          </h1>
        </div>
        <Link to={"/account/settings"}>
          <IoMdSettings className="text-5xl bg-black text-white rounded-full p-2" />
        </Link>
      </div>
      <div className="flex justify-between items-center mx-5 my-16">
        <h1 className="text-4xl font-bold">My Orders</h1>
        <div className="flex items-center gap-1 text-xl">
          <h1>View All Orders</h1>
          <IoIosArrowForward />
        </div>
      </div>
      <div>
        <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
          <Link to={"/account/to-pay"}>
            <li className="flex flex-col justify-center items-center ">
              <span className="bg-[#7F7F7F] rounded-3xl relative">
                <MdOutlinePayment className="text-[26vh] p-10" />
                <div className="w-10 h-10 bg-red-500 text-white rounded-full absolute top-[-2vh] right-[-2vh] flex items-center justify-center text-xl">
                  {orders.filter((e) => e.orderStatus === "To Pay").length}
                </div>
              </span>

              <p className="text-3xl">To Pay</p>
            </li>
          </Link>
          <Link to={"/account/to-ship"}>
            <li className="flex flex-col justify-center items-center ">
              <span className="rounded-3xl bg-[#7F7F7F] relative">
                <FaTruck className=" text-[26vh] p-10 " />

                <div className="w-10 h-10 bg-red-500 text-white rounded-full absolute top-[-2vh] right-[-2vh] flex items-center justify-center text-xl">
                  {orders.filter((e) => e.orderStatus === "To Ship").length}
                </div>
              </span>
              <p className="text-3xl">To Ship</p>
            </li>
          </Link>
          <Link to={"/account/to-receive"}>
            <li className="flex flex-col justify-center items-center ">
              <span className="relative bg-[#7F7F7F] rounded-3xl">
                <PiTrayArrowDownBold className=" text-[26vh] p-10 " />

                <div className="w-10 h-10 bg-red-500 text-white rounded-full absolute top-[-2vh] right-[-2vh] flex items-center justify-center text-xl">
                  {orders.filter((e) => e.orderStatus === "To Receive").length}
                </div>
              </span>
              <p className="text-3xl">To Receive</p>
            </li>
          </Link>
          <Link to={"/account/received"}>
            <li className="flex flex-col justify-center items-center ">
              <span className="relative rounded-3xl bg-[#7F7F7F] ">
                <FaCheckCircle className="text-[26vh] p-10 " />

                <div className="w-10 h-10 bg-red-500 text-white rounded-full absolute top-[-2vh] right-[-2vh] flex items-center justify-center text-xl">
                  {orders.filter((e) => e.orderStatus === "Received").length}
                </div>
              </span>

              <p className="text-3xl">Received</p>
            </li>
          </Link>
          <Link to={"/account/to-pickup"}>
            <li className="flex flex-col justify-center items-center ">
              <span className="relative bg-[#7F7F7F]  rounded-3xl">
                <div className="w-10 h-10 bg-red-500 text-white rounded-full absolute top-[-2vh] right-[-2vh] flex items-center justify-center text-xl">
                  {orders.filter((e) => e.orderStatus === "To Pickup").length}
                </div>
                <PiTrayArrowUpBold className="text-[26vh] p-10" />
              </span>

              <p className="text-3xl">To Pick Up</p>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default OrderHistory;
