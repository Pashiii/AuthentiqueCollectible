import React, { useState } from "react";
import { PiUserCircleFill } from "react-icons/pi";
import { IoIosCloseCircle } from "react-icons/io";
import LoadingTracking from "../../../components/LoadingTracking";
import ErrorInput from "../../../components/ErrorInput";
import { useGetUserOrderQuery } from "../../../redux/features/order/orderApi";
import { useGetSingleUserQuery } from "../../../redux/features/auth/authApi";
import { Link, useParams } from "react-router-dom";
import ViewVerification from "./ViewVerification";

function SingleCustomer() {
  const { id } = useParams();
  const [viewId, setViewId] = useState(false);
  const [idImage, setIdImage] = useState();

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${month}-${day}-${year}`;
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const { data: { orders = [] } = {} } = useGetUserOrderQuery(id, {
    pollingInterval: 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const handleViewId = (validId) => {
    setViewId(true);
    setIdImage(validId);
  };

  const {
    data: user,
    isLoading,
    error,
  } = useGetSingleUserQuery(id, {
    pollingInterval: 1000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  console.log(user);
  if (isLoading) return <LoadingTracking />;
  if (error) return <ErrorInput />;
  return (
    <div>
      {viewId && (
        <ViewVerification
          idImage={idImage}
          setViewId={setViewId}
          userId={user._id}
        />
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer’s Details</h1>
        <Link to={"/admin/customer"}>
          <IoIosCloseCircle className="text-red-400 text-[50px] cursor-pointer" />
        </Link>
      </div>
      <div className="flex-grow border-t border-black border-[2px]"></div>
      <div className="mt-6 grid grid-cols-2 gap-4  py-4 rounded-lg">
        <div className="bg-secondary ">
          <div className="flex justify-between items-center py-5 px-10 text-lg">
            <span className="font-bold">USER ID</span>
            <p className="flex w-3/4">{user._id}</p>
          </div>

          <div className="flex-grow border-t border-primary border-[1px]"></div>
          <div className="flex justify-between items-center py-5 px-10 text-lg">
            <span className="font-bold">Email</span>
            <p className="flex w-3/4">{user.email}</p>
          </div>
          <div className="flex-grow border-t border-primary border-[1px]"></div>

          <div className="flex justify-between items-center py-5 px-10 text-lg">
            <span className="font-bold">Joining Date</span>
            <p className="flex w-3/4">{formatDate(user.createdAt)}</p>
          </div>
          <div className="flex-grow border-t border-primary border-[1px]"></div>

          <div className="flex justify-between items-center py-5 px-10 text-lg">
            <span className="font-bold">First Name</span>
            <p className="flex w-3/4">
              {capitalizeFirstLetter(user.firstname)}
            </p>
          </div>
          <div className="flex-grow border-t border-primary border-[1px]"></div>

          <div className="flex justify-between items-center py-5 px-10 text-lg">
            <span className="font-bold">Last Name</span>
            <p className="flex w-3/4">{capitalizeFirstLetter(user.lastname)}</p>
          </div>
          <div className="flex-grow border-t border-primary border-[1px]"></div>

          <div className="flex justify-between items-center py-5 px-10 text-lg">
            <span className="font-bold">Birth Date</span>
            <p className="flex w-3/4">{formatDate(user.birthday)}</p>
          </div>
          <div className="flex-grow border-t border-primary border-[1px]"></div>

          <div className="flex justify-between items-center py-5 px-10 text-lg">
            <span className="font-bold">Mobile Number</span>
            <p className="flex w-3/4">{user.contact}</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <PiUserCircleFill className="w-64 h-60" />
          <p className="text-2xl font-bold">CaviteCollector</p>
          <p className="text-2xl">cavcollects@gmail.com</p>
          <div className="mt-4 space-y-2">
            <button
              className={`w-full  p-2 rounded-[20px] ${
                user.verificationID.verified === true
                  ? "bg-green-700 text-white"
                  : "bg-secondary"
              }`}
              onClick={() => handleViewId(user.verificationID)}
            >
              View ID
            </button>
            <button className="w-full bg-secondary p-2 rounded-[20px]">
              Archive
            </button>
            <button className="w-full bg-red-500 text-white p-2 rounded-[20px]">
              Revoke Account
            </button>
          </div>
        </div>
      </div>
      <div className="py-5">
        <h1 className="font-bold text-2xl">Order History:</h1>
        <table className="min-w-full bg-secondary ">
          <thead>
            <tr className="text-2xl">
              <th className="py-4 px-4 border">Order ID</th>
              <th className="py-4 px-4 border">Product Picture</th>
              <th className="py-4 px-4 border">Product Name</th>
              <th className="py-4 px-4 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <React.Fragment key={index}>
                {order.cartItems.map((item, i) => (
                  <tr key={i}>
                    {i === 0 && (
                      <td
                        rowSpan={order.cartItems.length}
                        className="py-4 px-4 border text-center text-xl "
                      >
                        {order._id}
                      </td>
                    )}

                    <td className="py-4 px-4 border  flex justify-center items-center ">
                      <img
                        src={item.image}
                        alt="Product"
                        className="w-[70px] h-[90px] object-cover border-black border-[1px] rounded-[10px]"
                      />
                    </td>
                    <td className="py-4 px-4 border text-center text-xl">
                      <h1 className="font-semibold">{item.title}</h1>
                      <h1>{item.category}</h1>
                    </td>
                    {i === 0 && (
                      <td
                        rowSpan={order.cartItems.length}
                        className="py-4 px-4 border text-center text-xl font-bold"
                      >
                        ₱
                        {order.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SingleCustomer;
