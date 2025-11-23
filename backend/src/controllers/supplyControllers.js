import SupplyOrder from "../models/SupplyOrder.js";

export const createSupplyOrder = async (req, res) => {
  try {
    const payload = req.body;
    const order = await SupplyOrder.create(payload);
    return res.status(201).json(order);
  } catch (err) {
    console.error("createSupplyOrder", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listSupplyOrdersForCooperative = async (req, res) => {
  try {
    const { coopId } = req.params;
    const orders = await SupplyOrder.find({ cooperative: coopId })
      .populate("supplier", "username")
      .populate("cooperative", "username");
    return res.json(orders);
  } catch (err) {
    console.error("listSupplyOrdersForCooperative", err);
    return res.status(500).json({ message: err.message });
  }
};

export const listAllSupplyOrdersForSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const orders = await SupplyOrder.find({ supplier: supplierId }).populate(
      "cooperative",
      "username"
    );
    return res.json(orders);
  } catch (err) {
    console.error("listAllSupplyOrdersForSupplier", err);
    return res.status(500).json({ message: err.message });
  }
};

export const updateSupplyOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await SupplyOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return res.json(order);
  } catch (err) {
    console.error("updateSupplyOrderStatus", err);
    return res.status(500).json({ message: err.message });
  }
};
