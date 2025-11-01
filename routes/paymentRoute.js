import express from "express";
import { generateTokenController, processPaymentController } from "../controllers/paymentController.js";

const router = express.Router();

// GET /api/v1/payment/token
router.get("/token", generateTokenController);

// POST /api/v1/payment/checkout
router.post("/checkout", processPaymentController);

export default router;
