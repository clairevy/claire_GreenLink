import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  cooperative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  sku: { type: String },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: "kg" },
  location: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Inventory", InventorySchema);
