import RequestPost from "../models/RequestPost.js";
import Bid from "../models/Bid.js";

export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      product,
      buyer,
      quantity,
      unitPrice,
      preferredDate,
    } = req.body;
    const post = await RequestPost.create({
      title,
      description,
      product,
      buyer,
      quantity,
      unitPrice,
      preferredDate,
    });
    return res.status(201).json(post);
  } catch (err) {
    console.error("createPost error", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listPosts = async (req, res) => {
  try {
    const { status = "open", buyer } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (buyer) filter.buyer = buyer;
    const posts = await RequestPost.find(filter)
      .populate("buyer", "username role")
      .populate("product");
    // attach isOwner flag when possible
    const userId = req.user && req.user.id ? req.user.id.toString() : null;
    const postsWithFlag = posts.map((p) => {
      const po = p.toObject ? p.toObject() : p;
      const buyerId =
        po.buyer && po.buyer._id
          ? po.buyer._id.toString()
          : po.buyer
          ? po.buyer.toString()
          : null;
      po.isOwner = userId && buyerId && userId === buyerId;
      return po;
    });
    return res.json(postsWithFlag);
  } catch (err) {
    console.error("listPosts error", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await RequestPost.findById(req.params.id)
      .populate("buyer", "username role")
      .populate("product");
    if (!post) return res.status(404).json({ message: "Not found" });
    const bids = await Bid.find({ post: post._id }).populate(
      "cooperative",
      "username"
    );
    return res.json({ post, bids });
  } catch (err) {
    console.error("getPost error", err);
    return res.status(500).json({ message: err.message });
  }
};

export const closePost = async (req, res) => {
  try {
    const post = await RequestPost.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );
    return res.json(post);
  } catch (err) {
    console.error("closePost error", err);
    return res.status(500).json({ message: err.message });
  }
};
