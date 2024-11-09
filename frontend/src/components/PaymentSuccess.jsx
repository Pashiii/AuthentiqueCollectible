import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../redux/features/order/orderApi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removetoCart } from "../redux/features/cart/cartSlice";

function PaymentSuccess() {
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const paymentId = queryParams.get("paymentId");
  const payerId = queryParams.get("PayerID");
  const hasConfirmed = useRef(false);
  const dispatch = useDispatch();

  const [newOrder] = useCreateOrderMutation();

  useEffect(() => {
    const checkPayment = async () => {
      if (hasConfirmed.current) return;

      try {
        hasConfirmed.current = true;

        if (!paymentId || !payerId) {
          console.log("Missing PayPal credentials or order ID.");
          navigate("/");
          return;
        }

        const getOrder = JSON.parse(sessionStorage.getItem("getOrder"));
        console.log(getOrder.transactionMethod);
        const response = await axios.post(
          "http://localhost:5000/api/orders/payment-confirm",
          {
            paymentId: paymentId,
            payerId: payerId,
            orderId: getOrder._id,
            totalAmount: getOrder.totalAmount,
            orderStatus: getOrder.transactionMethod,
          }
        );
        // const data = {
        //   paymentId,
        //   payerId,
        //   cartItems: getOrderInfo.cartItems,
        //   addressInfo: getOrderInfo.addressInfo,
        //   paymentMethod: getOrderInfo.paymentMethod,
        //   userId: getOrderInfo.userId,
        //   totalAmount: getOrderInfo.totalAmount,
        //   orderStatus: getOrderInfo.orderStatus,
        // };
        // console.log(data);

        // const response = await newOrder(data).unwrap();
        if (response?.data && response?.data?.message === "Payment Confirmed") {
          getOrder.cartItems.forEach((item) => {
            dispatch(removetoCart(item.productId));
          });
          sessionStorage.removeItem("orderId");
        } else {
          console.log(response?.data?.message || "Payment verification failed");
          console.log(response?.data?.error);
          navigate("/");
        }
      } catch (error) {
        console.log("Error confirming payment:", error);
        navigate("/");
      }
    };

    checkPayment();
  }, [paymentId, payerId, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-gray-50 px-16 py-14">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-200 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-8 w-8 text-white"
              >
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
        </div>
        <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
          Congratuation!!!
        </h3>
        <p className="w-[230px] text-center font-normal text-gray-600">
          Your order have been taken and is being attended to
        </p>
        <button
          className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-primary px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300"
          onClick={() => navigate("/account")}
        >
          Order History
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
