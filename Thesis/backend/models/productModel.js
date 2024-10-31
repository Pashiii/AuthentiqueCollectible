import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    image: [
      {
        public_id: { type: String, required: true },
        url: {
          type: String,
          require: true,
        },
      },
    ],
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    item: { type: String, required: true },
    category: String,
    price: { type: Number, required: true },
    oldPrice: Number,
    stocks: { type: Number, required: true },
    properties: {
      saleType: String,
      initialPay: Number,
      deadLine: Date,
      eta: Date,
      timeEnd: Date,
    },
    percent: String,
    description: String,
    author: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug from title
productSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = slugify(this.title, {
      lower: true, // Converts title to lowercase
      strict: true, // Removes special characters
      replacement: "-", // Replaces spaces with hyphens
    });
  }
  next();
});

const Products = mongoose.model("Product", productSchema);

export default Products;
