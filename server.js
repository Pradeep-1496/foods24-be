const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

// CORS setup
app.use(
  cors({
    origin: "*", // allow all origins (for dev)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//                                          DB Connection

// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foodapp');      //For Local(Mongo compass)
const connectDB = require("./config/db");
connectDB();

//  Routes
app.get("/", (req, res) => {
  res.send("<center><h2>  Welcome to Foods24 Backend  </h2></center>");
});

app.use("/auth/user", require("./routes/auth.user"));
app.use("/auth/admin", require("./routes/auth.admin"));
app.use("/auth/restaurant", require("./routes/auth.restaurant"));

// add menu by restaurant
app.use("/restaurant", require("./routes/dashboard.restaurant"));  //dashboard infomation 
app.use("/restaurant", require("./routes/menu.restaurant"));
app.use("/restaurant", require("./routes/restaurant.routes"));     //auth route

// List All Restaurant without login also
const restaurantRoutes = require("./routes/restaurant.routes");
app.use("/api/restaurants", require("./routes/restaurant.routes"));

// restaurant menu 
const menuRestaurantRoutes = require("./routes/menu.restaurant");
app.use("/api/restaurant", menuRestaurantRoutes);


// user order
app.use("/", require("./routes/order.routes"));

// add tables by restaurant
app.use("/restaurant", require("./routes/table.routes"));

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`\n\n\n\t\t\t\tApplication listening on port ${port}`)
);
