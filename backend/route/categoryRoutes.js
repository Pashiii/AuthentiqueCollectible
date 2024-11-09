import express from "express";
import Category from "../models/categoryModel.js";

const router = express.Router();

router.post("/create-category", async (req, res) => {
  const { productType, category } = req.body;
  const allowedProductTypes = ["Collectible", "Apparel", "Coffee"];
  if (!allowedProductTypes.includes(productType)) {
    return res.status(400).send({ message: "Invalid product type." });
  }
  try {
    const existingCategory = await Category.findOne({ category });
    if (!existingCategory) {
      const newCategory = new Category({
        productType,
        category,
      });
      await newCategory.save();
      return res.status(201).send({ message: "Category added successfully" });
    } else {
      return res.status(404).send({ message: "Category exist" });
    }
  } catch (error) {
    console.error("Error create category", error);
    return res.status(500).send({ message: "Failed to create the category" });
  }
});

router.get("/", async (req, res) => {
  try {
    const category = await Category.find({});
    if (!category) {
      return res.status(404).send({ message: "Category Not Found" });
    }
    res.status(200).send(category);
  } catch (error) {
    console.error("Error fetch category", error);
    return res.status(500).send({ message: "Failed to fetch the category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const categoryID = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryID);
    if (!deletedCategory) {
      return res.status(404).send({ message: "Category Not Found" });
    }
    return res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error delete category", error);
    return res.status(500).send({ message: "Failed to delete the category" });
  }
});

export default router;
