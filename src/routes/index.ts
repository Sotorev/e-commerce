import express from "express";
import userRoutes from "./user.routes"; 
import productRoutes from "./product.routes";
import faqRoutes from "./faq.routes";
import cartRoutes from "./cart.routes";

const router = express.Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/faqs', faqRoutes);
router.use('/cart', cartRoutes);

export default router;