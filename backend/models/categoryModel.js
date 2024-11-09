import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    productType: String,
    category: { type: String, required: true, unique: true },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);
export default Category;
