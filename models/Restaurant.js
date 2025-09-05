// const mongoose = require("mongoose");

// const restaurantSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   r_name: String,
//   location: String,
//   phone: String,
//   tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
//   menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
//   r_orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
// });

// module.exports = mongoose.model("Restaurant", restaurantSchema);

const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    r_id: { type: String, unique: true, sparse: true }, // 👈 use sparse so null won't conflict
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    r_name: { type: String, required: true },
    location: String,
    phone: { type: String, required: true },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    r_orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// Auto-increment r_id
restaurantSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    const lastRestaurant = await mongoose
      .model("Restaurant")
      .findOne({ r_id: { $ne: null } }) // only look at docs with valid IDs
      .sort({ createdAt: -1 });

    if (!lastRestaurant || !lastRestaurant.r_id) {
      this.r_id = "R001";
    } else {
      const lastId = parseInt(lastRestaurant.r_id.substring(1)); // remove "R"
      const newId = lastId + 1;
      this.r_id = "R" + newId.toString().padStart(3, "0");
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
