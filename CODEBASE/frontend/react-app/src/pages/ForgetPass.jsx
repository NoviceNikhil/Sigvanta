import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../componentsUser/CustomInput';
import { forgotPassword } from "../api/auth";

export default function ForgetPass({ showToast }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      return setError("Email is required");
    }

    try {
      setLoading(true);

      const res = await forgotPassword({ email });

      if (showToast) showToast("OTP sent to email");

      // 🔥 redirect to OTP page
      navigate("/verifyUserOtp", {
        state: {
          email: email.toLowerCase(),
          type: "forgot",
        },
      });

    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        ← Back
      </button>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Reset Password
      </h2>

      <p className="text-center text-gray-500 text-sm mb-6">
        Enter your email to receive OTP
      </p>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center mb-4 font-medium">
          {error}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <CustomInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {/* Button same as LOGIN */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-full bg-slate-700 hover:bg-slate-800 transition-colors text-white font-medium shadow-sm disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </>
  );
}