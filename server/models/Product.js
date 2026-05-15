const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    image: { type: String, required: true },
    badge: { type: String, default: null },
    desc: { type: String, required: true },
    perks: [String],
    stems: [String],
    stars: { type: Number, default: 5.0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
