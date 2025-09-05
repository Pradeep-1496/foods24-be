const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "myjwtsecret";

// Restaurant Register

router.post("/register", async (req, res) => {
  const { email, password, r_name, location, phone } = req.body;

  try {
    // 1. Validate inputs
    if (!email || !password || !r_name || !phone || !location) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const existing = await Restaurant.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const restaurant = await Restaurant.create({
      email,
      password: hashedPassword,
      r_name,
      location,
      phone,
    });

    res.status(201).json({ message: "Restaurant registered successfully" });
  } catch (err) {
  console.error(err); // This is the key step
  res.status(500).json({ error: "Server error", details: err.message });
}
});

// Restaurant Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant)
      return res.status(401).json({ error: "Restaurant not found" });

    const match = await bcrypt.compare(password, restaurant.password);
    if (!match) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { id: restaurant._id, role: "restaurant" },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
