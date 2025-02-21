const express = require("express");
const { register, verifyOtp, login, refreshToken, logout } = require("../controllers/authController");
const { verifyToken, requireRole } = require("../middlwares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Protected route for any authenticated user
router.get("/user/profile", verifyToken, (req, res) => {
  res.json({ message: "User Profile", user: req.user });
});

// Admin-only protected route
router.get("/admin/dashboard", verifyToken, requireRole("Admin"), (req, res) => {
  res.json({ message: "Admin Dashboard" });
});

module.exports = router;
