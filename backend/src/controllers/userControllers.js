import User from "../models/User.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching all users:", error); // Log the error for debugging for developers, not displayed to users
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublicCooperatives = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️  Database not connected, returning empty array");
      return res.status(200).json([]);
    }

    const raw = await User.find({ role: "cooperative" }).select(
      "username companyName address imageUrls phone"
    );

    console.log(`✅ Found ${raw.length} cooperatives`);

    const coops = raw.map((u) => ({
      _id: u._id,
      username: u.username,
      companyName: u.companyName || u.username,
      address: u.address || "",
      phone: u.phone || "",
      photo:
        (u.imageUrls && u.imageUrls.length && u.imageUrls[0]) ||
        "/default-coop.png",
    }));

    res.status(200).json(coops);
  } catch (error) {
    console.error("❌ Error fetching public cooperatives:", error.message);
    console.error("Stack:", error.stack);
    // Return empty array instead of error to prevent frontend crash
    res.status(200).json([]);
  }
};

export const getPublicCooperativeById = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️  Database not connected");
      return res.status(503).json({ message: "Database not available" });
    }

    const id = req.params.id;
    const u = await User.findById(id).select(
      "username companyName address phone imageUrls productTypes supplyCapacity deliveryAreas certifications"
    );
    if (!u) return res.status(404).json({ message: "Cooperative not found" });

    const coop = {
      _id: u._id,
      username: u.username,
      companyName: u.companyName || u.username,
      address: u.address || "",
      phone: u.phone || "",
      photo:
        (u.imageUrls && u.imageUrls.length && u.imageUrls[0]) ||
        "/default-coop.png",
      productTypes: u.productTypes || [],
      supplyCapacity: u.supplyCapacity || "",
      deliveryAreas: u.deliveryAreas || "",
      certifications: u.certifications || [],
    };

    res.status(200).json(coop);
  } catch (error) {
    console.error("❌ Error fetching coop by id:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
