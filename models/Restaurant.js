const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  r_name: String,
  location: String,
  phone: String,
  tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
  menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
  r_orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
