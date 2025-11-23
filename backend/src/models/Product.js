import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false },
    imageURL: { type: String, required: false },

    // Information about product
    dailyCapacity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, enum: ["kg", "gram", "tan"] },
    pricePerUnit: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },

    // Information about supplier
    cooperative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cooperative",
      required: true,
    },

    // Certification
    certificationTags: [String],

    isAvailable: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  },
  {
    timestamps: true,   // ✅ ĐÚNG: đặt trong options
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
