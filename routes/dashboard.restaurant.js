const express = require("express");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const authRole = require("../middleware/authRole");

const router = express.Router();

// ✅ Add Menu Item
router.post("/dashboard/menu", authRole("restaurant"), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ error: "Name and price required" });

    const item = await MenuItem.create({
      name,
      price,
      restaurant: req.user.id,
    });

    res.json({ message: "Menu item added", item });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Get all orders of restaurant
router.get("/dashboard/orders", authRole("restaurant"), async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.id })
      .populate("items.item", "name price")
      .populate("user", "name email");

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Update order status (pending → ongoing → completed)
router.put("/dashboard/orders/:id", authRole("restaurant"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "ongoing", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, restaurant: req.user.id },
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
