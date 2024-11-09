import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideNotification } from "../redux/features/cart/notificationSlice";

function CartNotification() {
  const navigate = useNavigate();

  const handleCartNavigate = () => {
    navigate("/cart");
    dispatch(hideNotification());
  };

  const dispatch = useDispatch();
  const { visible, message, title, image } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  return (
    <div>
      <div
        className={
          visible
            ? "absolute top-[100%] right-0 shadow-lg rounded-lg z-10 w-[400px]  bg-primary border-2 transition-all duration-300"
            : "absolute w-[400px]  bg-primary border-2 top-[-500%] right-0 shadow-lg rounded-lg z-10 transition-all duration-300"
        }
      >
        <div className="h-full">
          <h1 className="text-center text-lg pt-6 pb-2 text-green-500">
            {message}
          </h1>
          <div className="container">
            <div className="flex-grow border-t border-white border-[1px] mb-5"></div>
          </div>
          <div className="flex justify-center items-center px-5 gap-3">
            <img
              src={image}
              alt=""
              className="w-[170px] bg-white border-[2px] border-black rounded-[10px] shadow-xl"
            />
            <h1 className="text-white text-2xl">{title}</h1>
          </div>
          <div className="flex items-center justify-center pt-7 gap-5 pb-10">
            <button
              className="border-[1px] bg-secondary p-2 rounded-[5px] text-black"
              onClick={handleCartNavigate}
            >
              Proceed to Checkout
            </button>
            <button
              className="border-[1px] bg-white p-2 rounded-[5px] text-black"
              onClick={() => dispatch(hideNotification())}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartNotification;
