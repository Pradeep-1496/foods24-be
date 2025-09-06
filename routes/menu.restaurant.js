const express = require("express");
const router = express.Router();
const authRole = require("../middleware/authRole");
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const MenuItem = require("../models/MenuItem");

// ✅ Get Menu with items
router.get("/menu", authRole("restaurant"), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id).populate({
      path: "menu",
      populate: { path: "items" },
    });

    if (!restaurant || !restaurant.menu) {
      return res.json({ items: [] });
    }

    res.json(restaurant.menu);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Add item
router.post("/menu/item", authRole("restaurant"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const restaurant = await Restaurant.findById(req.user.id).populate("menu");

    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    let menu;
    if (!restaurant.menu) {
      menu = await Menu.create({ items: [] });
      restaurant.menu = menu._id;
      await restaurant.save();
    } else {
      menu = await Menu.findById(restaurant.menu._id);
    }

    const item = await MenuItem.create({ name, price, description });
    menu.items.push(item._id);
    await menu.save();

    res.json({ message: "Item added", item });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Update item
router.put("/menu/item/:id", authRole("restaurant"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item updated", item: updatedItem });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Delete item
router.delete("/menu/item/:id", authRole("restaurant"), async (req, res) => {
  try {
    const itemId = req.params.id;

    // Remove from Menu collection
    await Menu.updateOne(
      { items: itemId },
      { $pull: { items: itemId } }
    );

    // Delete the item
    const deleted = await MenuItem.findByIdAndDelete(itemId);

    if (!deleted) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
