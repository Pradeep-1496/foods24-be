const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authRole = require("../middleware/authRole");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number is required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, phone });

    // 🔑 Auto-login after registration
    const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, message: "User registered & logged in successfully" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed", details: err.message });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// ✅ Get User Profile
router.get("/me", authRole("user"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ✅ Update User Profile
router.put("/me", authRole("user"), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const updateData = { name, email, phone };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

module.exports = router;
