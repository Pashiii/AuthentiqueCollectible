import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingTracking from "./LoadingTracking";

function RemainingPayment() {
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const paymentId = queryParams.get("paymentId");
  const payerId = queryParams.get("PayerID");
  const hasConfirmed = useRef(false);

  useEffect(() => {
    const checkPayment = async () => {
      if (hasConfirmed.current) return;

      try {
        hasConfirmed.current = true;

        if (!payerId || !paymentId) {
          console.log("Missing Paypal credentials or order ID. ");
          navigate("/");
          return;
        }
        const getRemainingPay = JSON.parse(
          sessionStorage.getItem("RemainingPay")
        );
        console.log(getRemainingPay);

        const response = await axios.post(
          "http://localhost:5000/api/orders/payment-remaining",
          {
            paymentId: paymentId,
            payerId: payerId,
            orderId: getRemainingPay.orderId,
            remainingPay: getRemainingPay.remainingPay,
          }
        );
        if (
          response?.data &&
          response?.data?.message === "Payment successful"
        ) {
          toast.success(response?.data?.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          navigate("/account");
        } else {
          console.log(response?.data?.message || "Payment Failed");
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
  return <LoadingTracking />;
}

export default RemainingPayment;
