
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import CustomInput from "../componentsUser/CustomInput";
import { verifyAdminOtp } from "../api/auth";
import { setUser } from "../store/authSlice";
import { fetchAndStoreUser } from "../utils/fetchAndStoreUser"; // 🔥 ADD

export default function AdminOtp({ showToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;
  const userFromState = location.state?.user;   // optional
  const userId = location.state?.userId;        // 🔥 ADD

  // 🔥 HANDLE REFRESH CASE
  if (!email) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Session expired. Please login again.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-blue-600 underline"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      return setError("Please enter the OTP");
    }

    try {
      setLoading(true);

      const res = await verifyAdminOtp({ email, otp });

      if (showToast) showToast("OTP Verified successfully!");

      // 🔥 PRIORITY FLOW

      // ✅ 1. Backend sends full user
      if (res?.data?.data?.user) {
        dispatch(setUser(res.data.data.user));
      }

      // ✅ 2. From login state (if passed earlier)
      else if (userFromState) {
        dispatch(setUser(userFromState));
      }

      // ✅ 3. Only userId → fetch full user
      else if (userId) {
        await fetchAndStoreUser(userId, dispatch);
      }

      // ❌ fallback (very rare)
      else {
        dispatch(setUser({ email, role: "admin" }));
      }

      navigate("/");

    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-800"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Admin Verification
      </h2>

      <p className="text-center text-gray-500 text-sm mb-6">
        Please enter the OTP sent to your email
      </p>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4 font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleVerify} autoComplete="off">
        <CustomInput
          label="Enter OTP"
          type="text"
          value={otp}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 6) setOtp(value);
          }}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          inputMode="numeric"
        />

        <button
          disabled={loading}
          className="w-full py-3 mt-6 rounded-full bg-slate-700 hover:bg-slate-800 text-white font-medium disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </>
  );
}