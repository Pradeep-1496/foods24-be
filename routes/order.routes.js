const express = require("express");
const router = express.Router();
const authRole = require("../middleware/authRole");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// ✅ User places order
router.post("/", authRole("user"), async (req, res) => {
  try {
    const { restaurantId, items } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    let totalAmount = 0;
    const orderItems = [];

    for (const { itemId, quantity } of items) {
      const menuItem = await MenuItem.findById(itemId);
      if (!menuItem) return res.status(404).json({ error: `Item ${itemId} not found` });

      totalAmount += menuItem.price * quantity;
      orderItems.push({ item: menuItem._id, quantity });
    }

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurant._id,
      items: orderItems,
      totalAmount,
    });

    restaurant.r_orders.push(order._id);
    await restaurant.save();

    res.json(await order.populate("items.item", "name price"));
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Restaurant fetches its orders
router.get("/restaurant", authRole("restaurant"), async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.id })
      .populate("user", "name email")
      .populate("items.item", "name price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Restaurant updates status
router.put("/:id/status", authRole("restaurant"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "ongoing", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.item", "name price");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
