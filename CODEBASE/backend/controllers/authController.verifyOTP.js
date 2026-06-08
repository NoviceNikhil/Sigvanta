const authServisesOTP = require("../services/authServices.verifyOTP");
const { successResponse, errorResponse } = require("../utils/apiResponce");
const { writeAuthLog } = require("../utils/mongoLogs");

exports.verifyAdminOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(res, "email and otp required", null, 400);
    }

    email = email.trim().toLowerCase();
    otp = otp.trim();

    const data = await authServisesOTP.verifyAdminOTP(email, otp);

    // 🔥 set cookie
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: false,       // localhost
      sameSite: "lax",
      path: "/",           // 🔥 MUST
    });

    // Best-effort auth log
    writeAuthLog({
      user_id: data?.user?.id,
      provider: "otp",
      status: "success",
    });

    return successResponse(res, "Admin OTP verified successfully", data);

  } catch (err) {
    return errorResponse(
      res,
      err.message || "Admin OTP verification failed",
      null,
      err.statusCode || 500
    );
  }
};

exports.verifyUserOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(res, "email and otp required", null, 400);
    }

    // 🔥 normalize input (VERY IMPORTANT)
    email = email.trim().toLowerCase();
    otp = otp.trim();

    const data = await authServisesOTP.verifyUserOTP(email, otp);

    // 🔥 SIGNUP → set cookie
    if (data.token) {
      res.cookie("token", data.token, {
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return successResponse(res, "OTP verified successfully", data);

  } catch (err) {
    return errorResponse(
      res,
      err.message || "OTP verification failed",
      null,
      err.statusCode || 500
    );
  }
};
