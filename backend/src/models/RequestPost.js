import mongoose from "mongoose";

const RequestPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number },
  preferredDate: { type: Date },
  status: {
    type: String,
    enum: ["open", "closed", "cancelled"],
    default: "open",
  },
  createdAt: { type: Date, default: Date.now },
  meta: { type: Object },
});

export default mongoose.model("RequestPost", RequestPostSchema);
