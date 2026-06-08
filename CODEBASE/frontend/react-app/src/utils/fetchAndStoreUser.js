import API from "../api/axios";
import { setUser } from "../store/authSlice";

// 🔥 Fetch user by ID and store in Redux
export const fetchAndStoreUser = async (userId, dispatch) => {
  try {
    const res = await API.get(`/users/${userId}`); // 🔥 your API

    const user = res.data.data;

    // ❌ remove password if exists
    if (user.password) {
      delete user.password;
    }

    // 🔥 store in redux
    dispatch(setUser(user));

  } catch (err) {
    console.error("Error fetching user:", err);
  }
};