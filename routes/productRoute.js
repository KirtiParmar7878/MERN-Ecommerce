import express from "express";
import { 
  getAllProducts, 
  getProductsByCategory, 
  getSingleProduct,
  createProduct 
} from "../controllers/productController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getSingleProduct);

// Admin only routes
router.post("/create", requireSignIn, isAdmin, createProduct);

export default router;