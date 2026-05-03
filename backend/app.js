const express = require("express");
const app = express();
require("dotenv").config();
const memberRoutes = require("./routes/memberRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const uploadFile = require("./routes/uploadFileRoutes");
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("api working");
});

app.use("/api", uploadFile);
app.use("/api", memberRoutes);
app.use("/api", adminNotificationRoutes);

//routes error handller
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    url: req.originalUrl,
  });
});

//server error handller
app.use((err, req, res, next) => {
  console.error(err.stack); // console error log
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
