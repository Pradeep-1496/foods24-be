const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Menu = require("../models/Menu");
const MenuItem = require("../models/MenuItem");
const authRole = require("../middleware/authRole");

// ----------------- GET MENU -----------------
// GET /restaurant/menu
router.get("/menu", authRole("restaurant"), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id).populate({
      path: "menu",
      populate: { path: "items", model: "MenuItem" },
    });

    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    if (!restaurant.menu) return res.status(404).json({ error: "Menu not found" });

    res.json(restaurant.menu);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ----------------- ADD ITEM -----------------
// POST /restaurant/menu/item
router.post("/menu/item", authRole("restaurant"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const restaurant = await Restaurant.findById(req.user.id).populate("menu");

    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    // Create menu if not exists
    let menu;
    if (!restaurant.menu) {
      menu = await Menu.create({ items: [] });
      restaurant.menu = menu._id;
      await restaurant.save();
    } else {
      menu = await Menu.findById(restaurant.menu._id);
    }

    // Create new item
    const item = await MenuItem.create({ name, price, description });

    // Push into menu.items
    menu.items.push(item._id);
    await menu.save();

    res.json({ message: "Item added successfully", item });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


// ----------------- UPDATE ITEM -----------------
// PUT /restaurant/menu/item/:id
router.put("/menu/item/:id", authRole("restaurant"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const itemId = req.params.id;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      itemId,
      { name, price, description },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item updated", item: updatedItem });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ----------------- DELETE ITEM -----------------
// DELETE /restaurant/menu/item/:id
router.delete("/menu/item/:id", authRole("restaurant"), async (req, res) => {
  try {
    const itemId = req.params.id;
    const restaurant = await Restaurant.findById(req.user.id).populate("menu");

    if (restaurant.menu) {
      await Menu.findByIdAndUpdate(restaurant.menu._id, { $pull: { items: itemId } });
    }

    const deletedItem = await MenuItem.findByIdAndDelete(itemId);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item deleted", item: deletedItem });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
