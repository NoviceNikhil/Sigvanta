const jwt = require("jsonwebtoken");
const passport = require("passport");

const { successResponse, errorResponse } = require("../utils/apiResponce");
const { writeAuthLog } = require("../utils/mongoLogs");

// 🔹 Step 1: Redirect to Google
exports.redirectToGoogle = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

exports.googleCallback = async (req, res) => {
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
  const isProduction = process.env.NODE_ENV === "production";

  try {
    if (!req.user) {
      return res.redirect(`${frontendURL}/login`);
    }

    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // ✅ SET COOKIE (secure in production)
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Best-effort auth log
    writeAuthLog({
      user_id: req.user?.id,
      provider: "google",
      status: "success",
    });

    // 🔥 redirect without token in URL
    res.redirect(`${frontendURL}/`);
  } catch (err) {
    res.redirect(`${frontendURL}/login`);
  }
};
