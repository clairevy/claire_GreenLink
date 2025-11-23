import express from "express";
import {
  createSupplyOrder,
  listSupplyOrdersForCooperative,
  listAllSupplyOrdersForSupplier,
  updateSupplyOrderStatus,
} from "../controllers/supplyControllers.js";

const router = express.Router();

router.post("/", createSupplyOrder);
router.get("/coop/:coopId", listSupplyOrdersForCooperative);
router.get("/supplier/:supplierId", listAllSupplyOrdersForSupplier);
router.post("/:id/status", updateSupplyOrderStatus);

export default router;
