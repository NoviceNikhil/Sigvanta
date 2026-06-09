// hooks/useAuthInit.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../src/store/authSlice";
import { API_BASE_URL } from "../src/config";

const useAuthInit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Only fetch if Redux is empty (e.g. after Google redirect)
    if (user) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include", // sends the cookie
        });
        if (!res.ok) return; // not logged in, do nothing
        const json = await res.json();

        // fetch full user details using the id from token
        const userRes = await fetch(
          `${API_BASE_URL}/users/${json.data.id}`,
          {
            credentials: "include",
          },
        );
        const userData = await userRes.json();
        const fullUser = userData.data ?? userData;

        dispatch(setUser(fullUser)); // ← populates Redux + localStorage
      } catch (err) {
        // not authenticated, silently ignore
      }
    };

    fetchUser();
  }, []);
};

export default useAuthInit;
