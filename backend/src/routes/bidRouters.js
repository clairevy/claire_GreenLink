import express from "express";
import {
  createBid,
  listBidsForPost,
  listBidsForCooperative,
  updateBidStatus,
} from "../controllers/bidControllers.js";
import { verifyToken } from "../controllers/middlewareControllers.js";

const router = express.Router();

router.post("/", createBid);
router.get("/", async (req, res) => {
  // List all bids (for supplier view)
  try {
    const bids = await (await import("../models/Bid.js")).default
      .find()
      .populate("post cooperative");
    return res.json(bids);
  } catch (err) {
    console.error("listAllBids", err);
    return res.status(500).json({ message: err.message });
  }
});
router.get("/post/:postId", listBidsForPost);
router.get("/coop/:coopId", listBidsForCooperative);
router.post("/:id/status", verifyToken, updateBidStatus);

export default router;
