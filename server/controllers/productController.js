const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    // Enhance products with dynamic badge logic
    const enhanced = products.map((p) => {
      const product = p.toObject();

      // Handle missing or invalid createdAt
      const createdDate = product.createdAt
        ? new Date(product.createdAt)
        : new Date();
      const daysSinceCreated = Math.floor(
        (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Auto-assign "New" badge if created in last 7 days
      if (daysSinceCreated <= 7 && !product.badge) {
        product.badge = "New";
      }

      return product;
    });

    res.json(enhanced);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Add dynamic badge logic
    const productObj = product.toObject();
    const createdDate = productObj.createdAt
      ? new Date(productObj.createdAt)
      : new Date();
    const daysSinceCreated = Math.floor(
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceCreated <= 7 && !productObj.badge) {
      productObj.badge = "New";
    }

    res.json(productObj);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
