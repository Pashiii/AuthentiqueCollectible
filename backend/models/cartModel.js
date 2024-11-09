import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: String,
    cartItems: [
      {
        productId: String,
        category: String,
        title: String,
        slug: String,
        image: String,
        price: Number,
        stock: Number,
        oldPrice: Number,
        quantity: Number,
        properties: {
          saleType: String,
          initialPay: Number,
          deadLine: Date,
          eta: Date,
          timeEnd: Date,
        },
        remainingBalance: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Carts = mongoose.model("Cart", cartSchema);

export default Carts;
