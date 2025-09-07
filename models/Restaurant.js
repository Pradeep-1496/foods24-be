
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    r_id: { type: String, unique: true }, // ✅ required for auto-increment
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    r_name: String,
    location: String,
    phone: String,
    image: {
      type: String, // will store image path (e.g., "/uploads/16999999999.png")
      default: null,
    },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    r_orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// ✅ Auto-increment r_id before saving
restaurantSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    const lastRestaurant = await mongoose
      .model("Restaurant")
      .findOne()
      .sort({ createdAt: -1 });

    let nextId = "R001";
    if (lastRestaurant && lastRestaurant.r_id) {
      const lastNum = parseInt(lastRestaurant.r_id.slice(1), 10);
      nextId = "R" + String(lastNum + 1).padStart(3, "0");
    }

    this.r_id = nextId;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
