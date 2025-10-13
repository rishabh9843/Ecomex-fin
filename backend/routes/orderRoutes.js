import express from "express";
const router = express.Router();

// Import middleware
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Import controller functions
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate, // ✅ Corrected import name
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController.js";

// -- Public and Private Routes --
router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/:id").get(authenticate, findOrderById);

// -- Admin Routes --
router.route("/total-orders").get(authenticate, authorizeAdmin, countTotalOrders);
router.route("/total-sales").get(authenticate, authorizeAdmin, calculateTotalSales);
router.route("/total-sales-by-date").get(authenticate, authorizeAdmin, calculateTotalSalesByDate);

router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/deliver").put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
