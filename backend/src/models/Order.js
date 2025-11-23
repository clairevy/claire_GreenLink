import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  nameOrder: { type: String, required: true, trim: true },
});
