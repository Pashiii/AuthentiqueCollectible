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

export default router;
