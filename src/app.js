const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./utils/errorHandler"); // Custom error handler

dotenv.config();

// Import API routes
const investmentRoutes = require("./api/routes/investmentRoutes");
const redemptionRoutes = require("./api/routes/redemptionRoutes");
const balanceRoutes = require("./api/routes/balanceRoutes");
const metricsRoutes = require("./api/routes/metricsRoutes");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/investments", investmentRoutes);
app.use("/api/redemptions", redemptionRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/metrics", metricsRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running smoothly!" });
});

// Error Handling Middleware
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;
