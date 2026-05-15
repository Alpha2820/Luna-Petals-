const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { customer, items, total, deliverySlot, paymentMethod } = req.body;

    if (
      !customer ||
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pin ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !total ||
      !deliverySlot ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const orderNumber =
      "LP-" +
      Date.now().toString().slice(-6) +
      Math.floor(100 + Math.random() * 900);
    const order = await Order.create({ ...req.body, orderNumber });

    const io = req.app.get("io");
    if (io) {
      io.emit("new-order", order);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    const io = req.app.get("io");
    io.to(req.params.id).emit("status-update", {
      status,
      orderId: req.params.id,
    });

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrder, getAllOrders, updateOrderStatus };
