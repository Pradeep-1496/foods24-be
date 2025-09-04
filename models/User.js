const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  phone: { type: [Number], required: [true, 'phone number is required'] },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

module.exports = mongoose.model("User", userSchema);
