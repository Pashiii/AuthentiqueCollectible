import React from "react";
import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import { removeAllFromCart } from "../../redux/features/cart/cartSlice";

function OrderSuccessAlert({ payLink }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div>
      <div className="fixed inset-0 z-[9999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative m-4 p-4 w-2/5 min-w-[20%] max-w-[30%] rounded-3xl bg-secondary shadow-sm">
          <IoIosCloseCircle
            className="absolute right-5 text-red-500 text-4xl"
            onClick={() => {
              navigate("/cart");
              dispatch(removeAllFromCart());
            }}
          />
          <div className="flex shrink-0 items-center justify-center mt-10 text-xl font-medium text-slate-800">
            <FiCheck className=" bg-green-500 text-7xl p-2 rounded-full text-white font-bold" />
          </div>
          <div className="relative  border-slate-200 py-4 leading-normal  font-light">
            <p className="text-3xl font-bold text-center">
              Successfully Order Place!
            </p>
            <p className="text-center text-xl">
              Please always check your account for process update for your
              order!
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center py-4 justify-center ">
            <button
              className="rounded-2xl bg-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
              onClick={() => {
                navigate("/account/to-pay");
                window.location.href = payLink;
                dispatch(removeAllFromCart());
              }}
            >
              View my order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessAlert;
