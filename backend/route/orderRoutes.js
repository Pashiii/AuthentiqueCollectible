import express from "express";
import Orders from "../models/orderModel.js";
import paypal from "../components/paypal.js";
import Products from "../models/productModel.js";
import axios from "axios";
import tokenVerification from "../middleware/tokenVerification.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//creating paypal payment
router.post("/payment-process", async (req, res) => {
  try {
    const { cartItems, totalAmount } = req.body;

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

//checking payment paid & creating order
router.post("/payment-confirm", tokenVerification, async (req, res) => {
  const {
    paymentId,
    payerId,
    userId,
    cartItems,
    addressInfo,
    totalAmount,
    paymentMethod,
    orderStatus,
  } = req.body;

  try {
    const existingOrder = await Orders.findOne({ paymentId });
    if (existingOrder) {
      return res.status(409).send({ message: "Order already exists" });
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
          console.log(error.response);
          return res
            .status(500)
            .send({ message: "Payment execution failed", error });
        }
        const estimateDate = new Date();
        estimateDate.setDate(estimateDate.getDate() + 3);
        if (payment.state === "approved") {
          const order = new Orders({
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod: paymentMethod,
            paymentStatus: "Paid",
            totalAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: paymentId,
            payerId: payerId,
            estimatedDate: estimateDate,
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

          await order.save();
          res.status(201).send({ message: "Order Confirmed", order });
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
