import mongoose from "mongoose";
import slugify from "slugify";

const auctionSchema = new mongoose.Schema(
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
    item: { type: String, default: "Collectibles" },
    category: String,
    startingBid: { type: Number, required: true },
    currentBid: [
      {
        userId: String,
        userName: String,
        bid: Number,
        time: { type: Date, default: Date.now },
      },
    ],
    bidIncrement: Number,
    bidLimit: Number,
    countdown: { status: String, timeStart: Date, timeEnd: Date },
    stocks: { type: Number, default: 1 },
    properties: { type: String, default: "Auction" },
    description: String,
    author: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
auctionSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = slugify(this.title, {
      lower: true, // Converts title to lowercase
      strict: true, // Removes special characters
      replacement: "-", // Replaces spaces with hyphens
    });
  }
  next();
});

auctionSchema.methods.addBid = function (userId, userName, bidAmount) {
  const currentBids = this.currentBid;

  const highestBid =
    currentBids.length > 0
      ? Math.max(...currentBids.map((b) => b.bid))
      : this.startingBid;

  if (bidAmount <= highestBid) {
    throw new Error("Bid must be higher than the current highest bid");
  }

  const existingBidIndex = currentBids.findIndex((bid) => bid.id === userId);

  if (existingBidIndex !== -1) {
    currentBids[existingBidIndex].bid = bidAmount;
    currentBids[existingBidIndex].time = Date.now();
  } else {
    currentBids.push({
      userId: userId,
      userName: userName,
      bid: bidAmount,
      time: Date.now(),
    });
  }

  return this.save(); // Save the updated auction
};

auctionSchema.index({ slug: 1 });

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;
