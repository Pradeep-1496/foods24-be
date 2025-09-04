const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true },
    qrCode: { type: String },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
