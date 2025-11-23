import express from "express";
import {
  getAllUsers,
  getPublicCooperatives,
  getPublicCooperativeById,
} from "../controllers/userControllers.js";
import { deleteUserById } from "../controllers/userControllers.js";
import { verifyToken } from "../controllers/middlewareControllers.js";
const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/public/cooperatives", getPublicCooperatives);
router.get("/public/cooperatives/:id", getPublicCooperativeById);
router.delete("/:id", deleteUserById);
export default router;
