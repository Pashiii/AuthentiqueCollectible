import express from "express";
import Orders from "../models/orderModel.js";
import paypal from "../components/paypal.js";
import Products from "../models/productModel.js";
import tokenVerification from "../middleware/tokenVerification.js";
import jwt from "jsonwebtoken";
import cron from "node-cron";

const router = express.Router();

//removing unpaid
cron.schedule("0 0 * * *", async () => {
  console.log("Running a job to clean up unpaid orders...");

  try {
    const now = new Date();
    // Find all orders that are unpaid and where the reservation period has expired.
    const unpaidOrders = await Orders.find({
      paymentStatus: "Unpaid",
      reserved: { $lte: now },
    });

    if (unpaidOrders.length === 0) {
      console.log("No unpaid orders to delete.");
      return;
    }

    for (const order of unpaidOrders) {
      console.log(`Deleting order: ${order._id} - User: ${order.userId}`);

      // Restore stock for each item in the order before deleting it.
      for (const item of order.cartItems) {
        const product = await Products.findById(item.productId);
        if (product) {
          product.stocks += item.quantity;
          await product.save();
        }
      }

      // Delete the order
      await Orders.findByIdAndDelete(order._id);
    }

    console.log("Successfully deleted unpaid orders.");
  } catch (error) {
    console.error("Error cleaning up unpaid orders:", error);
  }
});

//create order
router.post("/payment-process", async (req, res) => {
  try {
    const {
      paymentId,
      payerId,
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      paymentMethod,
      transactionMethod,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:5173/payment/processing`,
        cancel_url: `http://localhost:5173/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "PHP",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "PHP",
            total: totalAmount,
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Error while creating PayPal payment",
          details: error.response.details,
        });
      } else {
        const estimateReserve = new Date();
        estimateReserve.setDate(estimateReserve.getDate() + 3);
        const newlyCreatedOrder = new Orders({
          userId,
          cartItems,
          addressInfo,
          orderStatus: "To Pay",
          paymentMethod: paymentMethod,
          transactionMethod: transactionMethod,
          paymentStatus: "Unpaid",
          totalAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
          paymentId,
          payerId,
          reserved: estimateReserve,
        });

        for (const item of cartItems) {
          const product = await Products.findById(item.productId);
          if (!product || product.stocks < item.quantity) {
            return res.status(400).send({
              message: `Not enough stock for ${item.name}`,
            });
          }

          product.stocks -= item.quantity;
          await product.save();
        }

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).send({
          message: "Successfully Order Place!",
          approvalURL,
          myOrder: newlyCreatedOrder,
        });
      }
    });
  } catch (error) {
    console.log("Some error occured", error);
    res.status(500).send({ message: "Some error occured!" });
  }
});

//creating a remaining payment
router.post("/remaining-payment", async (req, res) => {
  try {
    const { remainingPayment } = req.body;
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:5173/remaining-payment/processing`,
        cancel_url: `http://localhost:5173/`,
      },
      transactions: [
        {
          amount: {
            currency: "PHP",
            total: remainingPayment,
          },
          description: "description",
        },
      ],
    };
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Error while creating PayPal payment",
          details: error.response.details,
        });
      } else {
        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).send({ approvalURL });
      }
    });
  } catch (error) {
    console.log("Some error occured", error);
    res.status(500).send({ message: "Some error occured!" });
  }
});

//paying the unpaid
router.post("/pay-order", async (req, res) => {
  const { orderId } = req.body;
  try {
    const myOrder = await Orders.findById(orderId);
    if (!myOrder) {
      return res.status(404).send({ message: "Order not found" });
    }
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:5173/payment/processing`,
        cancel_url: `http://localhost:5173/`,
      },
      transactions: [
        {
          amount: {
            currency: "PHP",
            total: myOrder.totalAmount,
          },
          description: "description",
        },
      ],
    };
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Error while creating PayPal payment",
          details: error.response.details,
        });
      } else {
        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).send({ approvalURL });
      }
    });
  } catch (error) {}
});

//checking payment of remaining balance
router.post("/payment-remaining", async (req, res) => {
  const { paymentId, payerId, orderId, remainingPay } = req.body;
  try {
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "PHP",
            total: remainingPay,
          },
        },
      ],
    };
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.log(error.response);
          return res
            .status(500)
            .send({ message: "Payment execution failed", error });
        }
        if (payment.state === "approved") {
          let totalRemainingBalance = 0;
          order.cartItems.forEach((item) => {
            if (item.remainingBalance) {
              totalRemainingBalance += item.remainingBalance;
              item.price += item.remainingBalance;

              item.remainingBalance = 0;
            }
          });
          order.totalAmount += totalRemainingBalance;

          await order.save();

          return res.status(201).send({ message: "Payment successful" });
        } else {
          return res.status(400).send({ message: "Payment not approved" });
        }
      }
    );
  } catch (error) {
    console.log("Failed payment the remaining balance", error);
    return res
      .status(500)
      .send({ message: "Failed payment the remaining balance" });
  }
});

//checking payment paid & creating order
router.post("/payment-confirm", tokenVerification, async (req, res) => {
  const { paymentId, payerId, orderId, totalAmount, orderStatus } = req.body;
  try {
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "PHP",
            total: totalAmount,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.log("Payment execution failed:", error);
          return res
            .status(500)
            .send({ message: "Payment execution failed", error });
        }
        const estimateDate = new Date();
        estimateDate.setDate(estimateDate.getDate() + 3);
        if (payment.state === "approved") {
          order.paymentId = paymentId;
          order.payerId = payerId;
          order.orderStatus = orderStatus;
          order.paymentStatus = "Paid";
          order.estimatedDate = estimateDate;

          await order.save();
          res.status(201).send({ message: "Payment Confirmed", order });
        } else {
          res.status(400).send({ message: "Payment not approved" });
        }
      }
    );
  } catch (error) {
    console.log("Error confirming payment:", error);
    res.status(500).send({ message: "Error confirming payment", error });
  }
});

//cancel order
router.delete("/cancel-order/:id", async (req, res) => {
  const { id } = req.params;
  const { cartItems } = req.body;
  try {
    const cancelOrder = await Orders.findByIdAndDelete(id);
    if (!cancelOrder) {
      return res.status(404).send({ message: "Order not found" });
    }

    for (const item of cartItems) {
      const product = await Products.findById(item.productId);
      product.stocks += item.quantity;
      await product.save();
    }
    res.status(200).send({ message: "Order cancelled successfull" });
  } catch (error) {
    console.log("Failed to cancel order", error);
    res.status(500).send({ message: "Failed to cancel order" });
  }
});

//creating a token for checkout
router.post("/create-checkout-token", (req, res) => {
  const { userId, token } = req.body;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (decoded.userId === userId) {
        return res.json({ token, message: "Existing valid token" });
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.log("Token expired, generating a new one.");
      } else {
        console.error("Invalid token:", error);
      }
    }
  }

  const payload = { userId };
  const newToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token: newToken, message: "New token created" });
});

//get all orders
router.get("/", async (req, res) => {
  try {
    const { status, page = 1, limit = 0 } = req.query;
    let filter = {};
    const PreOrder = "Pre Order";
    let queryConditions = [];
    if (status && status === "Store Orders") {
      queryConditions.push({
        "cartItems.properties.saleType": { $ne: PreOrder },
      });
    }
    if (status && status !== "Store Orders") {
      queryConditions.push({ "cartItems.properties.saleType": status });
    }

    if (queryConditions.length > 0) {
      filter.$and = queryConditions;
    }
    // const query = queryConditions.length > 0 ? { $and: queryConditions } : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalOrder = await Orders.countDocuments(filter);
    const totalPages = Math.ceil(totalOrder / parseInt(limit));
    const orders = await Orders.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(404).send({ message: "No Orders" });
    }
    res.status(200).send({ orders, totalPages, totalOrder });
  } catch (error) {
    console.log("Error to fetch all orders", error);
    res.status(500).send({ message: " Error to fetch all orders" });
  }
});

//get user orders
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userOrders = await Orders.find({ userId });
    if (!userOrders) {
      return res.status(404).send({ message: "User Order Not Found" });
    }
    res
      .status(200)
      .send({ orders: userOrders, message: "Success to get order" });
  } catch (error) {
    console.log("Error to fetch user orders", error);
    res.status(500).send({ message: "Error to fetch user orders" });
  }
});

//get single orders
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).send({ message: "Order Not Found" });
    }
    res.status(200).send(order);
  } catch (error) {}
});

//update order status
router.put("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    if (orderStatus === "To Receive") {
      const estimateDate = new Date();
      estimateDate.setDate(estimateDate.getDate() + 3);
      order.estimatedDate = estimateDate;
    }

    order.orderStatus = orderStatus;
    await order.save();
    res
      .status(201)
      .send({ message: "Status updated successfully", order: order });
  } catch (error) {
    console.log("Failed to update order status", error);
    res.status(500).send({ message: "Failed to update order status" });
  }
});

router.put("/auction-order/:id", async (req, res) => {
  const { id } = req.params;
  const {
    totalAmount,
    addressInfo,
    paymentMethod,
    transactionMethod,
    cartItems,
  } = req.body;
  try {
    const auctionOrder = await Orders.findById(id);

    if (!auctionOrder) {
      return res.status(404).send({ message: "Order not found" });
    }
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:5173/payment/processing`,
        cancel_url: `http://localhost:5173/shop/paypal-cancel`,
      },
      transactions: [
        {
          // item_list: {
          //   items: cartItems.map((item) => ({
          //     name: item.title,
          //     sku: item.productId,
          //     price: item.price.toFixed(2),
          //     currency: "PHP",
          //     quantity: item.quantity,
          //   })),
          // },
          amount: {
            currency: "PHP",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).send({
          message: "Error while creating PayPal payment",
          details: error.response.details,
        });
      } else {
        const estimateReserve = new Date();
        estimateReserve.setDate(estimateReserve.getDate() + 3);
        auctionOrder.addressInfo = addressInfo;
        auctionOrder.paymentMethod = paymentMethod;
        auctionOrder.reserved = estimateReserve;
        auctionOrder.orderDate = new Date();
        auctionOrder.orderUpdateDate = new Date();
        auctionOrder.paymentStatus = "Unpaid";
        auctionOrder.orderStatus = "To Pay";
        auctionOrder.transactionMethod = transactionMethod;
        auctionOrder.paymentId = "";
        auctionOrder.payerId = "";
        await auctionOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).send({
          message: "Successfully Order Place!",
          approvalURL,
          myOrder: auctionOrder,
        });
      }
    });
  } catch (error) {}
});

// router.post("/create-order", tokenVerification, async (req, res) => {
//   try {
//     const {
//       paymentId,
//       payerId,
//       cartItems,
//       addressInfo,
//       paymentMethod,
//       transactionMethod,
//       totalAmount,
//       userId,
//     } = req.body;

//     const createNewOrder = new Orders({
//       paymentId: paymentId,
//       payerId: payerId,
//       cartItems: cartItems,
//       addressInfo: addressInfo,
//       paymentMethod: paymentMethod,
//       transactionMethod: transactionMethod,
//       userId: userId,
//       totalAmount: totalAmount,
//       paymentStatus: "paid",
//       orderStatus: "confirmed",
//       orderDate: Date.now(),
//     });

//     for (const item of cartItems) {
//       const product = await Products.findById(item.productId);
//       if (!product || product.stocks < item.quantity) {
//         return res.status(400).send({
//           message: `Not enough stock for ${item.name}`,
//         });
//       }

//       product.stocks += item.quantity;
//       await product.save();
//     }

//     await createNewOrder.save();

//     res.status(200).send({ message: "Order Confirmed" });
//   } catch (error) {
//     console.log("Error Failed to Create Order", error);
//     res.status(500).send({ message: "Failed to Create Orders" });
//   }
// });

export default router;
