import express from "express";
import data from "./data.js";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
// import seedRouter from "./route/seedRoutes.js";
import productRoutes from "./route/productRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import User from "./models/userModel.js";
import router from "./route/userRoutes.js";

dotenv.config();
const app = express();

// //middleware
// app.use(express.json({ limit: "25mb" }));
// app.use(express.urlencoded({ limit: "25mb" }));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// //routes
// app.use("/api/auth", router);

// app.use("/api/products", productRoutes);

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("connected to db");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
app.get("/api/products", (req, res) => {
  res.send(data.products);
});

app.get("/api/products/collections/apparels", (req, res) => {
  res.send(data.apparelsProduct);
});

app.get("/api/products/slug/:slug", (req, res) => {
  const product =
    data.products.find((x) => x.slug === req.params.slug) ||
    data.apparelsProduct.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.get("/api/products/related/:item", (req, res) => {
  const products = data.apparelsProduct
    .filter(
      (x) => x.item.toLowerCase().split(" ").join("-") === req.params.item
    )
    .concat(
      data.products.filter(
        (x) => x.item.toLowerCase().split(" ").join("-") === req.params.item
      )
    );

  if (products.length > 0) {
    res.send(products);
  } else {
    res.status(404).send({ message: "No Products Found" });
  }
});

app.get("/api/products/slug/:slug", (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.get("/api/products/:id", (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  const product =
    data.products.find((x) => x._id === requestedId) ||
    data.apparelsProduct.find((x) => x._id === requestedId);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

app.get("/api/products/collections/view-all-products", (req, res) => {
  res.send(data.products);
});

app.get("/api/products/collections/:propertiesOritem", (req, res) => {
  const { propertiesOritem } = req.params;

  const products = data.products.filter((x) => {
    const properties = x.properties
      ? x.properties.toLowerCase().split(" ").join("-")
      : "";
    const item = x.item ? x.item.toLowerCase().split(" ").join("-") : "";
    return properties === propertiesOritem || item === propertiesOritem;
  });

  if (products.length > 0) {
    res.send(products);
  } else {
    res.status(404).send({ message: "No Products Found" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
