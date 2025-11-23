import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import RequestPost from "../models/RequestPost.js";
import SupplyOrder from "../models/SupplyOrder.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createBid = async (req, res) => {
  try {
    const { post: postId, cooperative, price, quantity, eta, notes } = req.body;
    // ensure post exists and is open
    const post = await RequestPost.findById(postId);
    if (!post || post.status !== "open")
      return res.status(400).json({ message: "Post not open" });
    const bid = await Bid.create({
      post: postId,
      cooperative,
      price,
      quantity,
      eta,
      notes,
    });
    return res.status(201).json(bid);
  } catch (err) {
    console.error("createBid", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listBidsForPost = async (req, res) => {
  try {
    const bids = await Bid.find({ post: req.params.postId }).populate(
      "cooperative",
      "username role"
    );
    return res.json(bids);
  } catch (err) {
    console.error("listBidsForPost", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listBidsForCooperative = async (req, res) => {
  try {
    const { coopId } = req.params;
    const bids = await Bid.find({ cooperative: coopId }).populate("post");
    return res.json(bids);
  } catch (err) {
    console.error("listBidsForCooperative", err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateBidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending','accepted','rejected'
    // find the bid and ensure requester is authorized (buyer who created the post)
    const bid = await Bid.findById(id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const post = await RequestPost.findById(bid.post);
    if (!post)
      return res.status(404).json({ message: "Related post not found" });

    // req.user must be set by auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only the buyer who created the post may update bid status
    if (!post.buyer || post.buyer.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({
          message: "Only the buyer who created the post can update bid status",
        });
    }

    // Use a mongoose transaction to make acceptance atomic when possible
    const { supplierId } = req.body;
    if (status === "accepted") {
      let session;
      try {
        session = await mongoose.startSession();
        session.startTransaction();

        // reload docs within session
        const bidDoc = await Bid.findById(id).session(session);
        if (!bidDoc) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ message: "Bid not found" });
        }
        const postDoc = await RequestPost.findById(bidDoc.post).session(
          session
        );
        if (!postDoc) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ message: "Related post not found" });
        }

        bidDoc.status = status;
        await bidDoc.save({ session });

        postDoc.status = "closed";
        await postDoc.save({ session });

        // determine supplier: prefer supplierId from request, otherwise pick an existing supplier or create fallback
        let supplier = null;
        if (supplierId) {
          supplier = await User.findById(supplierId).session(session);
          if (!supplier || supplier.role !== "supplier") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Invalid supplierId" });
          }
        } else {
          supplier = await User.findOne({ role: "supplier" }).session(session);
          if (!supplier) {
            const username = "sample_supplier_auto";
            const email = "sample_supplier_auto@example.com";
            const rawPassword = "password123";
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(rawPassword, salt);
            supplier = new User({
              username,
              email,
              password: hashed,
              role: "supplier",
              isConfirmed: true,
            });
            await supplier.save({ session });
          }
        }

        const qty = bidDoc.quantity || postDoc.quantity || 0;
        const item = {
          product: postDoc.product,
          quantity: qty,
          unitPrice: bidDoc.price,
        };
        const orderPayload = {
          cooperative: bidDoc.cooperative,
          supplier: supplier._id,
          items: [item],
          notes: `Auto-created after buyer accepted bid ${bidDoc._id}`,
        };
        const order = new SupplyOrder(orderPayload);
        await order.save({ session });

        bidDoc.supplyOrder = order._id;
        await bidDoc.save({ session });

        await session.commitTransaction();
        session.endSession();

        // return the updated bid (populating some fields could be done here)
        const resultBid = await Bid.findById(id).populate("cooperative");
        return res.json(resultBid);
      } catch (e) {
        console.error("Transactional acceptance failed", e);
        if (session) {
          try {
            await session.abortTransaction();
          } catch (ex) {
            console.error("Error aborting transaction", ex);
          }
          session.endSession();
        }
        // Fallback: attempt a non-transactional update so the operation still completes
        try {
          bid.status = status;
          await bid.save();
        } catch (ex2) {
          console.error("Fallback bid save failed", ex2);
        }
        return res
          .status(500)
          .json({ message: "Failed to accept bid atomically" });
      }
    }

    // non-accepted statuses update
    bid.status = status;
    await bid.save();
    return res.json(bid);
  } catch (err) {
    console.error("updateBidStatus", err);
    return res.status(500).json({ message: err.message });
  }
};
