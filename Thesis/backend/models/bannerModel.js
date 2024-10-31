import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    image: { type: [String], required: true },
    link: String,
    author: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Banners = mongoose.model("Banner", bannerSchema);

export default Banners;
