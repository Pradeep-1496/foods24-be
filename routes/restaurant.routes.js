const express = require("express");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

/**
 * @route   GET /api/restaurants
 * @desc    Get all restaurants with basic info + menu
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("menu")      // fetch menu object
      .populate("tables");   // fetch tables if needed

    res.json(restaurants); // ✅ return array
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get a single restaurant by ID with full details
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate({
        path: "menu",
        populate: { path: "items" }, // fetch menu items with price
      })
      .populate("tables")
      .populate("r_orders"); // optional: orders

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    console.error("Error fetching restaurant:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
