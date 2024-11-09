import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
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
    addressInfo: {
      name: String,
      addressId: String,
      barangay: String,
      street: String,
      region: String,
      city: String,
      province: String,
      phone: Number,
      notes: String,
    },
    reserved: Date,
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    paymentId: String,
    payerId: String,
    transactionMethod: String,
    estimatedDate: Date,
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", orderSchema);

export default Orders;
