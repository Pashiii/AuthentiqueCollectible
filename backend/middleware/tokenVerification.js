import paypal from "../components/paypal.js"; // PayPal SDK

const tokenVerification = async (req, res, next) => {
  const { paymentId, payerId } = req.body;

  if (!paymentId || !payerId) {
    return res.status(400).send({ message: "Missing paymentId or payerId" });
  }

  try {
    // Fetch payment details from PayPal
    paypal.payment.get(paymentId, function (error, payment) {
      if (error) {
        console.log(error.response);
        return res.status(400).send({
          message: "Invalid or expired PayPal token",
          details: error.response.details,
        });
      } else {
        // Check if the payment is already approved
        const transactionStatus = payment.state;
        if (transactionStatus === "created") {
          // Execute the payment to mark the token as used
          const execute_payment_json = {
            payer_id: payerId,
          };

          paypal.payment.execute(
            paymentId,
            execute_payment_json,
            function (error, payment) {
              if (error) {
                console.log(error.response);
                return res.status(400).send({
                  message: "Error executing PayPal payment",
                  details: error.response.details,
                });
              } else {
                if (payment.state === "approved") {
                  // Payment executed and approved, token is now expired
                  next(); // Continue to the order creation route
                } else {
                  return res
                    .status(400)
                    .send({ message: "Payment not approved or invalid" });
                }
              }
            }
          );
        } else {
          // If payment is already executed or invalid
          return res.status(400).send({
            message: "Payment has already been processed or is invalid",
          });
        }
      }
    });
  } catch (error) {
    console.log("Error verifying PayPal token", error);
    res.status(500).send({ message: "Error verifying PayPal token" });
  }
};

export default tokenVerification;
