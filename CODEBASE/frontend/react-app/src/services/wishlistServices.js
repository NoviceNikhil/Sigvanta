import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/v1/wishlist`;

// Pass userId here!
const getWishlist = async (userId) => {
  if (!userId) return [];
  try {
    const res = await axios.get(`${BASE_URL}/get/${userId}`);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

// Pass userId here!
const addToWishlist = async (userId, productId) => {
  try {
    const res = await axios.post(`${BASE_URL}/add/${userId}`, { productId });
    return res.data.data || { success: true };
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return null;
  }
};

// Pass userId here!
const removeFromWishlist = async (userId, productId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/remove/${userId}/${productId}`);
    return res.data.data || { success: true };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return null;
  }
};

export const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};