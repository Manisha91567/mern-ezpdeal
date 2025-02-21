require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');
const { sequelize } = require("./models");
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

// Define rate limiting for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many OTP requests from this IP, please try again later.'
});

// Routes
app.use('/', otpLimiter, authRoutes);

// Start the server and connect to the DB
const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Database connection failed:", error));
