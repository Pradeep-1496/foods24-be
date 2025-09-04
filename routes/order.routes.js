const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const MenuItem = require('../models/MenuItem');
const Restaurant = require("../models/Restaurant");

// POST /order/place
router.post("/order/place", async (req, res) => {
  try {
    const { restaurantId, items } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    let totalAmount = 0;
    const orderItems = [];

    for (const entry of items) {
      const menuItem = await MenuItem.findById(entry.itemId);
      if (!menuItem)
        return res
          .status(404)
          .json({ error: `Item ${entry.itemId} not found` });

      totalAmount += menuItem.price * entry.quantity;
      orderItems.push({
        item: menuItem._id,
        quantity: entry.quantity,
      });
    }

    const order = new Order({
      restaurant: restaurant._id,
      user: req.user.id,
      items: orderItems,
      totalAmount,
    });

    await order.save();

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET /restaurant/:id/orders – Restaurant can see their orders
router.get("/restaurant/:id/orders", async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.id })
      .populate("user", "name email")
      .populate("items.item", "name price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
