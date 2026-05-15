const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createOrder);
router.get("/all", protect, getAllOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", protect, updateOrderStatus);

module.exports = router;
