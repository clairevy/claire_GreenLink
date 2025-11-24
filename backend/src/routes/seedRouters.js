import express from "express";
import { seedData, checkDataStatus } from "../controllers/seedControllers.js";

const router = express.Router();

// Check data status (public)
router.get("/status", checkDataStatus);

// Seed data endpoint (protected)
router.post("/run", seedData);

export default router;
