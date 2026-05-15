const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pin: { type: String, required: true },
    },
    items: [
      {
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    deliverySlot: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["Order Placed", "Preparing", "Out for Delivery", "Delivered"],
      default: "Order Placed",
    },
    orderNumber: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
