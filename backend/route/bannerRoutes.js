import express from "express";
import Banners from "../models/bannerModel.js";

const router = express.Router();

router.post("/create-banner", async (req, res) => {
  try {
    const newBanner = new Banners({
      ...req.body,
    });
    const savedBanner = await newBanner.save();
    res.status(201).send(savedBanner);
  } catch (error) {
    console.log("Error creating banner", error);
    res.status(500).send({ message: "Failed creating banner" });
  }
});

router.get("/", async (req, res) => {
  try {
    const banner = await Banners.find({}).sort({
      createdAt: -1,
    });
    res.status(200).send(banner);
  } catch (error) {
    console.log("Error fetching banner", error);
    res.status(500).send({ message: "Error fetching banner" });
  }
});

router.delete("/remove-banner/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removeBanner = await Banners.findByIdAndDelete(id);
    if (!removeBanner) {
      return res.status(404).send({ message: "Banner not found" });
    }
    return res.status(200).send({ message: "Successful remove banner" });
  } catch (error) {
    console.log("Failed to remove banner", error);
    return res.status(500).send({ message: "Failed to remove banner" });
  }
});

export default router;
