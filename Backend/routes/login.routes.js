const express = require('express');
const router = express.Router();
const loginControllers = require("../controllers/login.controller");

// Authentication routes
router.post("/login", loginControllers.logIn);
router.post("/register", loginControllers.register);

// Protected routes (require authentication)
router.get("/dashboard", loginControllers.verifyToken, loginControllers.getDashboard);
router.get("/verify", loginControllers.verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    user: req.user
  });
});

// Admin-only routes
router.get("/admin/stats", loginControllers.verifyToken, loginControllers.requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    data: {
      message: "This is an admin-only endpoint",
      user: req.user
    }
  });
});

module.exports = router;