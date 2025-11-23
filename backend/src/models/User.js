import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 6,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 50,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["customer", "cooperative", "buyer", "supplier"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },
    companyName: { type: String },
    contactName: { type: String },
    phone: { type: String },
    taxId: { type: String },
    address: { type: String },
    // Cooperative-specific
    productTypes: { type: [String], default: [] },
    supplyCapacity: { type: String },
    deliveryAreas: { type: String },
    certifications: { type: [String], default: [] },
    otherCertification: { type: String },
    businessLicenseUrl: { type: String },
    imageUrls: { type: [String], default: [] },
    // Email confirmation
    isConfirmed: { type: Boolean, default: false },
    confirmToken: { type: String },
    confirmTokenExpiry: { type: Date },
  },

  { timestamps: true } //tu dong them createdAt va updatedAt
);
const User = mongoose.model("User", userSchema); //tao model User tu userSchema
export default User; //export de su dung o nhung file khac
