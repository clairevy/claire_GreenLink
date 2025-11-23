import express from "express";
import {
  upsertInventory,
  listInventoryForCooperative,
} from "../controllers/inventoryControllers.js";

const router = express.Router();

router.post("/upsert", upsertInventory);
router.get("/coop/:coopId", listInventoryForCooperative);

export default router;
