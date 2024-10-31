import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

//all routes
import authRoutes from "./route/userRoutes.js";
import productRoutes from "./route/productRoutes.js";
import bannerRoutes from "./route/bannerRoutes.js";
import categoryRoutes from "./route/categoryRoutes.js";
import auctionRoutes from "./route/auctionRoutes.js";
import orderRoutes from "./route/orderRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();

//middleware
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/auction", auctionRoutes);
app.use("/api/orders", orderRoutes);

main()
  .then(() => console.log("Mongodb is successfully connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
