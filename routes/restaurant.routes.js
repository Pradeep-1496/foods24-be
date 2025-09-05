const express = require("express");
const Restaurant = require("../models/Restaurant");
const router = express.Router();

// Get all restaurants with details
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("menu")  // if you want to fetch menu details too
      .populate("tables"); // if you want to show table info

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

module.exports = router;
