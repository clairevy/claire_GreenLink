import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RequestPost",
    required: true,
  },
  cooperative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  eta: { type: Date },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  supplyOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupplyOrder",
  },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String },
});

export default mongoose.model("Bid", BidSchema);
