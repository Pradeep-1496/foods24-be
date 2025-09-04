const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// DB Connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodapp');
const connectDB = require("./config/db");
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("<center><h2>  Welcome to backend  </h2></center>");
});

app.use("/auth/user", require("./routes/auth.user"));
app.use("/auth/admin", require("./routes/auth.admin"));
app.use("/auth/restaurant", require("./routes/auth.restaurant"));

// add menu by restaurant
app.use("/restaurant", require("./routes/menu.restaurant"));
app.use("/restaurant", require("./routes/restaurant.routes"));

// user order
app.use("/", require("./routes/order.routes"));

// add tables by restaurant
app.use("/restaurant", require("./routes/table.routes"));

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`\n\n\n\t\t\t\tApplication listening on port ${port}`)
);
