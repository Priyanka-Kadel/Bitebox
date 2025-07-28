const express = require("express");
const router = express.Router();
const { 
    createOrder,
    getOrderStatus,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/:orderId/status", getOrderStatus);

// Protected routes (authentication required)
router.use(protect);

// User routes
router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

// Admin routes
router.get("/", authorize('admin'), getAllOrders);
router.put("/:id/status", authorize('admin'), updateOrderStatus);

module.exports = router; 