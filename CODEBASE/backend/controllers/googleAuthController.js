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
  try {
    if (!req.user) {
      return res.redirect("http://localhost:5173/login");
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

    // ✅ SET COOKIE (secure)
    res.cookie("token", token, {
      httpOnly: true, // 🔥 cannot access from JS
      secure: false, // ⚠️ true in production (HTTPS)
      sameSite: "lax", // or "strict"
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
    res.redirect("http://localhost:5173/");
  } catch (err) {
    res.redirect("http://localhost:5173/login");
  }
};
