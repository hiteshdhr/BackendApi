const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// protected route - need token to access
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
