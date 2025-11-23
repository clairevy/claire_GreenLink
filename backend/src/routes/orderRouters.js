import mongoose from 'mongoose';
const router = mongoose.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);
export default router;