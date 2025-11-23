import mongoose from "mongoose";

const SupplyOrderSchema = new mongoose.Schema({
  cooperative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number },
    },
  ],
  status: {
    type: String,
    enum: ["requested", "confirmed", "shipped", "delivered", "cancelled"],
    default: "requested",
  },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String },
});

export default mongoose.model("SupplyOrder", SupplyOrderSchema);
