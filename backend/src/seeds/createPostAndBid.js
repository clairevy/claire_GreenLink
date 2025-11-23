import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import RequestPost from "../models/RequestPost.js";
import Bid from "../models/Bid.js";

dotenv.config();

(async function () {
  try {
    await connectDB();
    // pick first product
    const product = await Product.findOne();
    if (!product) {
      console.error("No product found");
      process.exit(1);
    }

    // create or get buyer
    const buyerUsername = "sample_buyer_auto";
    await User.deleteMany({ username: buyerUsername });
    const buyer = await User.create({
      username: buyerUsername,
      email: `${buyerUsername}@example.test`,
      password: "password123",
      role: "buyer",
      isConfirmed: true,
    });

    // create a request post
    const post = await RequestPost.create({
      title: "Yêu cầu mua rau cải ngọt",
      description: "Cần rau cải ngọt tươi",
      product: product._id,
      buyer: buyer._id,
      quantity: 100,
      unitPrice: product.pricePerUnit,
      preferredDate: new Date(Date.now() + 3 * 24 * 3600 * 1000),
    });

    // create a bid from the product's cooperative
    const cooperativeId = product.cooperative;
    const bid = await Bid.create({
      post: post._id,
      cooperative: cooperativeId,
      price: product.pricePerUnit + 1,
      quantity: 100,
      eta: new Date(Date.now() + 5 * 24 * 3600 * 1000),
      notes: "Có thể giao theo yêu cầu",
    });

    console.log("Created post:", JSON.stringify(post, null, 2));
    console.log("Created bid:", JSON.stringify(bid, null, 2));
    process.exit(0);
  } catch (e) {
    console.error("ERR", e);
    process.exit(1);
  }
})();
