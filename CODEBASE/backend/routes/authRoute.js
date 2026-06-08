const express = require("express");
const authrouter = express.Router();

const passport = require("passport");

const userController = require("../controllers/userController");

const authController = require("../controllers/authController");
const {
  verifyAdminOtp,
  verifyUserOTP,
} = require("../controllers/authController.verifyOTP");
const {
  redirectToGoogle,
  googleCallback,
} = require("../controllers/googleAuthController");
const authenticate = require("../middleware/authenticate_middlewere");

authrouter.post("/login", authController.login);
authrouter.post("/login/admin/verify_otp", verifyAdminOtp);
authrouter.post("/signup", authController.signup);

authrouter.get("/profile", authenticate, userController.getProfile);

authrouter.post("/forgot-password", authController.forgotPassword);
authrouter.post("/login/user/verify_otp", verifyUserOTP);
authrouter.post("/reset-password", authController.resetPassword);

authrouter.get("/protected", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

authrouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});

// 🔹 Step 1: Redirect to Google
authrouter.get("/google", redirectToGoogle);

// 🔹 Step 2: Callback
authrouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

// authRoutes.js
authrouter.get("/me", authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = authrouter;
