import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

(async function () {
  try {
    await connectDB();
    const products = await Product.find().populate({
      path: "cooperative",
      model: "User",
      select: "username companyName",
    });
    console.log("PRODUCTS:", JSON.stringify(products, null, 2));
    if (products.length > 0) {
      const coopId = products[0].cooperative?._id || products[0].cooperative;
      const inventory = await Inventory.find({ cooperative: coopId }).populate(
        "product"
      );
      console.log("INVENTORY FOR COOP:", coopId);
      console.log(JSON.stringify(inventory, null, 2));
    }
    process.exit(0);
  } catch (e) {
    console.error("ERR", e);
    process.exit(1);
  }
})();
