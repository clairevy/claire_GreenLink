import Inventory from "../models/Inventory.js";

export const upsertInventory = async (req, res) => {
  try {
    const { cooperative, product, sku, quantity, unit, location } = req.body;
    const filter = { cooperative, product, sku };
    const update = { quantity, unit, location, updatedAt: new Date() };
    const opts = { new: true, upsert: true };
    const item = await Inventory.findOneAndUpdate(filter, update, opts);
    return res.json(item);
  } catch (err) {
    console.error("upsertInventory", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listInventoryForCooperative = async (req, res) => {
  try {
    const { coopId } = req.params;
    const items = await Inventory.find({ cooperative: coopId }).populate(
      "product"
    );
    return res.json(items);
  } catch (err) {
    console.error("listInventoryForCooperative", err);
    return res.status(500).json({ message: err.message });
  }
};
