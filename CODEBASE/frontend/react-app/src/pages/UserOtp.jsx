import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux"; // 🔥 ADD

import CustomInput from "../componentsUser/CustomInput";
import { verifyUserOtp } from "../api/auth";
import { setUser } from "../store/authSlice"; // 🔥 ADD
// import { fetchAndStoreUser } from "../utils/fetchAndStoreUser"; // 🔥 ADD

export default function UserOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // 🔥 ADD

  const email = location.state?.email;
  const type = location.state?.type;
  const userId = location.state?.userId; // 🔥 ADD (if passed)

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !type) {
      navigate("/login");
    }
  }, [email, type, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) return setError("OTP required");

    try {
      setLoading(true);

      const res = await verifyUserOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      const result = res.data.data;
      console.log("result")
      console.log(result);
      console.log("token")
      console.log(result.token)

      // =========================
      // 🔥 SIGNUP FLOW
      // =========================

      console.log("TYPE RECEIVED:", type);
      console.log("TOKEN RECEIVED:", result.token);
      console.log("TOKEN RECEIVED:", result.user);
      if(type == "signup" && result.token){
        // showToast("Signup successful");
        console.log("yes yes Successfull")

        // ✅ 1. backend sends full user
        if (result.user) {
          dispatch(setUser(result.user));
        }

        // // ✅ 2. fallback → userId
        else if (userId) {
          await fetchAndStoreUser(userId, dispatch);
        }

        navigate("/");
      }

      // =========================
      // 🔥 FORGOT PASSWORD FLOW
      // =========================
      else if (type === "forgot" && result.resetToken) {
        // showToast("OTP verified");

        navigate("/reset-password", {
          state: { email, token: result.resetToken },
        });
      }

      else {
        setError("Something went wrong");
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setError(msg);

      if (msg === "Invalid OTP") setOtp("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔙 Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-800"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        {type === "forgot" ? "Verify OTP" : "Email Verification"}
      </h2>

      <p className="text-center text-gray-500 text-sm mb-6">
        OTP sent to <span className="font-semibold">{email}</span>
      </p>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4 font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        <CustomInput
          label="Enter OTP"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 6) setOtp(value);
          }}
          maxLength={6}
          inputMode="numeric"
          placeholder="Enter 6-digit OTP"
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-full bg-slate-700 hover:bg-slate-800 text-white font-medium shadow-sm disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </>
  );
}