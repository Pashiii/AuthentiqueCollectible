import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalCheckout = () => {
  const [success, setSuccess] = useState(false);

  const handleApprove = (orderId) => {
    // Handle successful payment here
    setSuccess(true);
    console.log("Order successful:", orderId);
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Aa8BH15w_4mZJ9uAMUAaNtM8SxHrTiC7-ybiJ6G74jpKsOQmMckr-EH8ENS-iJZEK-WzvlBfyMCCr-yT",
      }}
    >
      <div>
        <h2>Pay with PayPal</h2>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "25.00",
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              handleApprove(details.id);
            });
          }}
        />
        {success && <div>Payment successful!</div>}
      </div>
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
