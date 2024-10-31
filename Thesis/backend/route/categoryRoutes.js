import express from "express";
import Category from "../models/categoryModel.js";

const router = express.Router();

router.post("/create-category", async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
    });
    const savedCategory = await newCategory.save();
    res.status(201).send(savedCategory);
  } catch (error) {
    console.error("Error create category", error);
    res.status(500).send({ message: "Failed to create the category" });
  }
});

router.get("/", async (req, res) => {
  try {
    const category = await Category.find({});
    if (!category) {
      res.status(404).send({ message: "Category Not Found" });
    }
    res.status(200).send(category);
  } catch (error) {
    console.error("Error fetch category", error);
    res.status(500).send({ message: "Failed to fetch the category" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const categoryID = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryID);
    if (!deletedCategory) {
      res.status(404).send({ message: "Category Not Found" });
    }
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error delete category", error);
    res.status(500).send({ message: "Failed to delete the category" });
  }
});

export default router;
