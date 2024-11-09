import express from "express";
import Products from "../models/productModel.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import cloudinary from "../components/cloudinary.js";

const router = express.Router();

//create new product
router.post("/create-product", async (req, res) => {
  const {
    image,
    title,
    item,
    category,
    price,
    oldPrice,
    stocks,
    onSale,
    properties,
    description,
    percent,
  } = req.body;
  try {
    const existingProduct = await Products.findOne({ title });
    if (existingProduct) {
      return res.status(404).send({ message: "Product name exist" });
    }
    const uploadedImages = [];
    for (const img of image) {
      const result = await cloudinary.uploader.upload(img, {
        folder: "products",
        // width: 300,
        // crop: "scale",
      });
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    const newProduct = new Products({
      title,
      item,
      image: uploadedImages,
      category,
      price,
      oldPrice,
      stocks,
      onSale,
      properties,
      description,
      percent,
    });
    const savedProduct = await newProduct.save();
    res
      .status(201)
      .send({ message: "Product added successfully", savedProduct });
  } catch (error) {
    console.error("Error creating product", error);
    res.status(500).send({ message: "Failed to create the product" });
  }
});

//get all the products
router.get("/", async (req, res) => {
  try {
    const {
      category,
      item,
      saleType,
      minPrice,
      maxPrice,
      page = 1,
      limit = 0,
    } = req.query;
    let filter = {};

    let orConditions = [];

    if (item && category && saleType === "View All Products") {
      orConditions.push({ item: "Collectible" });
    }
    if (item && item !== "View All Products") {
      orConditions.push({ item: item });
    }
    if (saleType && saleType !== "View All Products") {
      orConditions.push({ "properties.saleType": saleType });
    }
    if (category && category !== "View All Products") {
      orConditions.push({ category: category });
    }
    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }
    if (minPrice & maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", " email")
      .sort({ createdAt: -1 });
    if (products.length === 0) {
      return res.status(404).send({ message: "No Products" });
    }

    // If products are found, return the products along with pagination info
    res.status(200).send({ products, totalPages, totalProducts });
  } catch (error) {
    console.log("Error fetching products", error);
    res.status(500).send({ message: "Error fetching products" });
  }
});

//get single product by slug
router.get("/:slug", async (req, res) => {
  try {
    const productSlug = req.params.slug;
    const product = await Products.findOne({ slug: productSlug }).populate(
      "author",
      "email"
    );
    if (!product) {
      return res.status(404).send({ message: "Product Not Found" });
    }
    res.status(200).send({ product });
  } catch (error) {
    console.error("Error fetching product", error);
    res.status(500).send({ message: "Failed to fetch the product" });
  }
});

//update product
router.put(
  "/update-product/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const productId = req.params.id;
    const {
      title,
      item,
      category,
      price,
      oldPrice,
      imageURL,
      stocks,
      onSale,
      properties,
      description,
      percent,
    } = req.body;
    try {
      const updateProduct = await Products.findById(productId);
      if (!updateProduct) {
        return res.status(404).send({ message: "Product not found" });
      }
      console.log(imageURL);
      const uploadedImages = [];
      const imagesToRemove = updateProduct.image.filter(
        (image) => !imageURL.includes(image.url)
      );
      for (const image of imagesToRemove) {
        await cloudinary.uploader.destroy(image.public_id);
      }
      for (const img of imageURL) {
        const imageExists = updateProduct.image.find(
          (image) => image.url === img
        );

        if (imageExists) {
          uploadedImages.push(imageExists);
        } else {
          const result = await cloudinary.uploader.upload(img, {
            folder: "products",
          });
          uploadedImages.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      }
      updateProduct.title = title;
      updateProduct.item = item;
      updateProduct.category = category;
      updateProduct.price = price;
      updateProduct.oldPrice = oldPrice;
      updateProduct.stocks = stocks;
      updateProduct.onSale = onSale;
      updateProduct.properties = properties;
      updateProduct.description = description;
      updateProduct.percent = percent;
      updateProduct.image = uploadedImages;

      await updateProduct.save();
      res.status(201).send({
        message: "Product updated successfully",
        product: updateProduct,
      });
    } catch (error) {
      console.error("Error updating the product", error);
      res.status(500).send({ message: "Failed to update the product" });
    }
  }
);

//delete product
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    for (const img of product.image) {
      const publicId = img.public_id;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const deletedProduct = await Products.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(500).send({ message: "Failed to delete the product" });
  }
});

//related product
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).send({ message: "Product ID is required" });
    }
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const titleRegex = new RegExp(
      product.title
        .split(" ")
        .filter((word) => word.length > 1)
        .join("|"),
      "i"
    );

    const relatedProducts = await Products.find({
      _id: { $ne: id },
      $or: [{ title: { $regex: titleRegex } }, { category: product.category }],
    });

    res.status(200).send(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products", error);
    res.status(500).send({ message: "Failed to fetch related products" });
  }
});

// Update the product to remove the onSale field
router.patch("/remove-on-sale/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).send({ message: "Product Not Found" });
    }
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      {
        $unset: { oldPrice: "" },
        $set: {
          price: product.oldPrice,
          "properties.saleType": "",
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product Not Found" });
    }

    res
      .status(200)
      .send({ message: "onSale removed", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).send({ message: "Failed to update the product" });
  }
});

export default router;
