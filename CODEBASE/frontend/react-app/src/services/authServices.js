import axios from "axios";

const AUTH_URL = `http://localhost:3000/auth/protected`;
const USERS_URL = `http://localhost:3000/users`; // Your users route base

const getLoggedInUser = async () => {
  // ⚠️ Paste your JWT from Postman right here inside the quotes
  const HARDCODED_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzQ5NDI1OTYsImV4cCI6MTc3NTAyODk5Nn0.M4P8OrE7hNDH050BsgYy96yYEOqQWUlQEa0YrUQ9jLs";

  // Create a reusable config object for our headers
  const config = {
    headers: {
      Authorization: `Bearer ${HARDCODED_TOKEN}`,
    },
  };

  try {
    // Step 1: Hit the protected route to decode the token and get the ID
    const authRes = await axios.get(AUTH_URL, config);
    console.log("authres:", authRes);
    const userId = authRes.data.user.id;

    // Step 2: Use that ID to fetch the full user details from the Users route
    const userRes = await axios.get(`${USERS_URL}/${userId}`, config);

    // Depending on how your getUserById controller formats the response,
    // you might need to adjust this (e.g., userRes.data.data or userRes.data.user)
    const fullUserDetails = userRes.data.data || userRes.data;

    console.log("Full logged in user---->", fullUserDetails);

    return fullUserDetails;
  } catch (error) {
    console.error(
      "Failed to fetch full user details:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

const logout = async () => {
  await axios.post(
    "http://localhost:3000/auth/logout",
    {},
    { withCredentials: true }, // needed to send/clear the cookie
  );
  localStorage.clear();
};

export const authService = {
  getLoggedInUser,
  logout,
};
