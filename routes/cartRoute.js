import express from "express";
import { addToCartController, getCartController } from "../controllers/cartController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add to cart (POST) - requires sign in
router.post("/", requireSignIn, addToCartController);

// Get cart for user
router.get("/", requireSignIn, getCartController);

export default router;
