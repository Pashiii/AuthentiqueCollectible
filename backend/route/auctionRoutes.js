import express from "express";
import Auction from "../models/auctionModel.js";
import { Server } from "socket.io";
import http from "http";
import cloudinary from "../components/cloudinary.js";
import { sendEmail } from "../middleware/email.js";

const router = express.Router();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

//create a auction
router.post("/create-auction", async (req, res) => {
  const {
    image,
    title,
    item,
    category,
    startingBid,
    currentBid,
    countdown,
    properties,
    description,
    bidLimit,
    bidIncrement,
  } = req.body;
  try {
    const uploadedImages = [];
    for (const img of image) {
      const result = await cloudinary.uploader.upload(img, {
        folder: "auctions",
        // width: 300,
        // crop: "scale",
      });
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    const newAuction = new Auction({
      image: uploadedImages,
      title,
      item,
      category,
      startingBid,
      currentBid,
      countdown,
      properties,
      description,
      bidLimit,
      bidIncrement,
    });
    const savedAuction = await newAuction.save();
    res.status(201).send({ message: "Success add auction", savedAuction });
  } catch (error) {
    console.error("Error creating auction product", error);
    res.status(500).send({ message: "Failed to creating the auction product" });
  }
});

//get all auction
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = 10;
  try {
    const auctions = await Auction.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(page * limit);

    res.status(200).send(auctions);
  } catch (error) {
    console.error("Error fetching auction product", error);
    res.status(500).send({ message: "Failed to fetch the auction product" });
  }
});

//get single auction
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const auction = await Auction.findOne({ slug: slug }).populate(
      "author",
      "email"
    );
    if (!auction) {
      return res.status(404).send({ message: "Auction not found" });
    }
    res.status(200).send(auction);
  } catch (error) {
    console.error("Error fetching single auction product", error);
    res
      .status(500)
      .send({ message: "Failed to fetch the single auction product" });
  }
});

//placing bid
router.put("/:id/bid", async (req, res) => {
  const { id } = req.params;
  const { userId, userName, bid } = req.body;

  try {
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    const limitBid = auction.currentBid.filter((e) => e.userId === userId);

    if (limitBid.length !== auction.bidLimit) {
      await auction.addBid(userId, userName, bid);
      io.emit("newBid", { auctionId: id, bid });
      res.status(200).json({
        message: "Bid placed successfully",
        currentBid: auction.currentBid,
      });
    } else {
      res.status(500).send({ message: "You exceed the limit of bidding" });
    }
  } catch (error) {
    console.error("Error fetching single auction product", error);
    res.status(400).json({ message: error.message });
  }
});

//email winner
router.post("/bid/winner/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const highestBid = auction.currentBid.reduce(
      (max, e) => (e.bid > max.bid ? e : max),
      { bid: 0 }
    );
    console.log(highestBid);

    if (highestBid) {
      await sendEmail({
        email: highestBid.userName,
        subject: "Congratulations! You've Won the Auction",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
          <img src="images/logo.png" style="display: block; margin: 0 auto;"/>
          <h2 style="color: #333;">Congratulations!</h2>
          <p style="color: #555;">You are the highest bidder for the item: <strong>${
            auction.title
          }</strong>.</p>
          <p style="color: #555;">Your winning bid is: <strong>₱${highestBid.bid.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}</strong>.</p>
          <a href="$" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Proceed to Checkout</a>
          <p style="color: #555;">Please complete your payment within the next 48 hours to secure your item.</p>
          <p style="color: #555;">If the button does not work, copy and paste the following link into your browser:</p>
          <p style="color: #007BFF; word-break: break-all;">$</p>
          <p style="color: #999;">Thank you for participating,<br>The Authentique Collectible</p>
        </div>
        `,
      });
    }
  } catch (error) {}
});

//edit auction
router.patch("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    category,
    description,
    imageURL,
    startingBid,
    bidIncrement,
    bidLimit,
    countdown,
  } = req.body;
  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).send({ message: "Auction Not Found" });
    }
    const uploadedImages = [];
    const imagesToRemove = auction.image.filter(
      (image) => !imageURL.includes(image.url)
    );

    for (const image of imagesToRemove) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    for (const img of imageURL) {
      const imageExists = auction.image.find((image) => image.url === img);

      if (imageExists) {
        uploadedImages.push(imageExists);
      } else {
        const result = await cloudinary.uploader.upload(img, {
          folder: "auctions",
        });
        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }
    auction.title = title;
    auction.category = category;
    auction.description = description;
    auction.image = uploadedImages;
    auction.startingBid = startingBid;
    auction.bidIncrement = bidIncrement;
    auction.bidLimit = bidLimit;
    auction.countdown = countdown;

    await auction.save();
    res.status(201).send({ message: "Auction updated successfully" });
  } catch (error) {
    console.log("Failed to update auction", error);
    res.status(500).send({ message: "Failed to update auction" });
  }
});

export default router;
