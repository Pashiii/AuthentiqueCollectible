import express from "express";
import Carts from "../models/cartModel.js";

const router = express.Router();

//adding to cart
router.post("/add-cart/:userId", async (req, res) => {
  const { userId } = req.params;
  const newCartItem = req.body;
  try {
    let userCart = await Carts.findOne({ userId });

    if (userCart) {
      // Check if the item already exists in the cart
      const itemIndex = userCart.cartItems.findIndex(
        (item) => item.productId === newCartItem.productId
      );

      if (itemIndex >= 0) {
        // If item exists, increase its quantity
        userCart.cartItems[itemIndex].quantity += newCartItem.quantity;
      } else {
        userCart.cartItems.push(newCartItem);
      }
      await userCart.save();
      return res
        .status(200)
        .send({ message: "Cart updated successfully", cart: userCart });
    } else {
      const newCart = new Carts({
        userId,
        cartItems: [newCartItem],
      });

      const addedCart = await newCart.save();
      return res
        .status(201)
        .send({ message: "Cart created and item added", cart: addedCart });
    }
  } catch (error) {
    console.log("Failed add to cart", error);
    res.status(500).send({ message: "Failed add to cart" });
  }
});

//remove from cart
router.delete("/delete-item-cart/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const userCart = await Carts.findOne({ userId });
    if (userCart) {
      userCart.cartItems = userCart.cartItems.filter(
        (item) => item.productId !== productId
      );
      await userCart.save();

      return res
        .status(200)
        .send({ message: "Item removed from cart", cart: userCart });
    } else {
      return res.status(404).send({ message: "Cart not found for this user" });
    }
  } catch (error) {
    console.error("Failed to delete item from cart", error);
    res.status(500).send({ message: "Failed to delete item from cart" });
  }
});

//changing quantity
router.patch("/cart-quantity/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;
  try {
    const userCart = await Carts.findOne({ userId });
    if (!userCart) {
      return res.status(404).send({ messsage: "Cart not found for this use" });
    }
    const itemIndex = userCart.cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).send({ message: "Product not found in cart" });
    }
    if (userCart.cartItems[itemIndex].quantity <= 0) {
      return res.status(404).send({ message: "Product quantity must be 0" });
    }
    userCart.cartItems[itemIndex].quantity += quantity;

    await userCart.save();
    return res
      .status(200)
      .send({ message: "Quantity change successfully", cart: userCart });
  } catch (error) {
    console.log("Error to change quantity", error);
    return res
      .status(500)
      .send({ message: "Failed to change quantity product" });
  }
});

export default router;
