import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// ✅ DEBUG MIDDLEWARE - Remove after fixing
router.use((req, res, next) => {
  console.log(`📦 Order Route: ${req.method} ${req.originalUrl}`);
  console.log(`🔐 Authenticated: ${!!req.user}`);
  next();
});

// Order routes
router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

// User-specific orders (requires auth)
router.route("/mine").get(authenticate, getUserOrders);

// ✅ Public stats endpoints (no auth required)
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
