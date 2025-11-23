import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

async function seed() {
  await connectDB();
  try {
    const username = "sample_buyer_auto";
    const email = "sample_buyer_auto@example.com";
    const rawPassword = "password123";

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(rawPassword, salt);

    const existing = await User.findOne({ username });
    if (existing) {
      existing.email = email;
      existing.password = hashed;
      existing.role = "buyer";
      existing.isConfirmed = true;
      await existing.save();
      console.log("Updated existing user", username);
    } else {
      const u = new User({
        username,
        email,
        password: hashed,
        role: "buyer",
        isConfirmed: true,
        contactName: "Auto Buyer",
      });
      await u.save();
      console.log("Created user", username);
    }
    process.exit(0);
  } catch (e) {
    console.error("Seed buyer error", e);
    process.exit(1);
  }
}

seed();
