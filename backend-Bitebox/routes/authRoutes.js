// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  uploadImage,
  refreshToken,
  verifyToken
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { loginAttemptLimiter } = require("../middleware/rateLimiter");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginAttemptLimiter, loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/refresh-token", refreshToken);
router.post("/verify-token", verifyToken);

module.exports = router;