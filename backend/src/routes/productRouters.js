import express from 'express';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/productControllers.js';
const router = express.Router();
router.get("/", getAllProducts);

router.post("/", createProduct);
router.put("/", updateProduct);
router.delete("/", deleteProduct);
export default router;
