import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: { type: String, unique: true, required: true },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);
export default Category;
