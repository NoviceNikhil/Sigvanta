// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import CustomInput from "../componentsUser/CustomInput";
// import { signupUser } from "../api/auth";

// export default function Signup({ showToast }) {
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!data.name || !data.email || !data.password || !data.confirmPassword) {
//       return setError("All fields are required");
//     }

//     if (data.password !== data.confirmPassword) {
//       return setError("Passwords do not match");
//     }

//     // Password validation: min 6 chars, at least 1 number and 1 special character
//     const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

//     if (!passwordRegex.test(data.password)) {
//       return setError(
//         "Password must be at least 6 characters long and include a number and a special character"
//       );
//     }

//     try {
//       setLoading(true);

//       const res = await signupUser({
//         name: data.name,
//         email: data.email,
//         password: data.password,
//       });

//       const responseData = res.data.data;

//       if (showToast) showToast("OTP sent to email");

//       navigate("/verifyUserOtp", {
//         state: {
//           email: responseData.email,
//           type: "signup" // 🔥 IMPORTANT
//         },
//       });

//     } catch (err) {
//       setError(err?.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-500">
//         ← Back
//       </button>

//       <h2 className="text-2xl font-bold text-center mb-2">
//         Create an Account
//       </h2>

//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//       <form onSubmit={handleSubmit}>
//         <CustomInput
//           label="Full Name"
//           value={data.name}
//           onChange={(e) => setData({ ...data, name: e.target.value })}
//         />

//         <CustomInput
//           label="Email"
//           type="email"
//           value={data.email}
//           onChange={(e) => setData({ ...data, email: e.target.value })}
//         />

//         <CustomInput
//           label="Password"
//           type="password"
//           value={data.password}
//           onChange={(e) => setData({ ...data, password: e.target.value })}
//         />

//         <CustomInput
//           label="Confirm Password"
//           type="password"
//           value={data.confirmPassword}
//           onChange={(e) =>
//             setData({ ...data, confirmPassword: e.target.value })
//           }
//         />

//         <button
//           disabled={loading}
//           className="w-full py-3 mt-4 bg-slate-700 text-white rounded-full"
//         >
//           {loading ? "Creating..." : "Sign Up"}
//         </button>
//       </form>

//       <p className="text-center mt-4">
//         Already have an account? <Link to="/login"><span className="text-slate-700 font-bold cursor-pointer">Login</span></Link>
//       </p>
//     </>
//   );
// }

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomInput from "../componentsUser/CustomInput";
import { signupUser } from "../api/auth";

export default function Signup({ showToast }) {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      return setError("All fields are required");
    }

    if (data.password !== data.confirmPassword) {
      return setError("Passwords do not match");
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(data.password)) {
      return setError(
        "Password must be at least 6 characters long and include a number and a special character"
      );
    }

    try {
      setLoading(true);

      const res = await signupUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const responseData = res.data.data;

      if (showToast) showToast("OTP sent to email");

      navigate("/verifyUserOtp", {
        state: {
          email: responseData.email,
          type: "signup",
        },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-2">
        Create an Account
      </h2>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <CustomInput
          label="Full Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <CustomInput
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                  <path d="M10.88 9.88a3 3 0 0 1 4.24 4.24" />
                  <path d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={data.confirmPassword}
              onChange={(e) =>
                setData({
                  ...data,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setShowConfirmPassword((v) => !v)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
                  <path d="M10.88 9.88a3 3 0 0 1 4.24 4.24" />
                  <path d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-3 mt-4 bg-slate-700 text-white rounded-full"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login">
          <span className="text-slate-700 font-bold cursor-pointer">
            Login
          </span>
        </Link>
      </p>
    </>
  );
}