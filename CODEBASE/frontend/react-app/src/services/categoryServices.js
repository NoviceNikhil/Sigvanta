import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/v1/category`;

const getAllCategories = async () => {
  const res = await axios.get(BASE_URL);
  // console.log("all categories ------->", res.data)
  return res.data?.data || res.data || [];
};

const getAllCategoriesforproducts = async () => {
  try {
    const res = await axios.get(BASE_URL);

    // 1. Get the raw list (handling different possible nesting)
    const rawData = res.data?.data || res.data || [];
    console.log(rawData);
    // 2. Map and Clean: Return only what the frontend needs
    const result = rawData.map((category) => ({
      ID: category.ID || category.ID, // Handle case sensitivity
      categoryname: category.categoryname,
      createdAt: category.createdAt,
      // Explicitly excluding 'icon' and 'color' here
    }));
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const createCategory = async (data) => {
  return await axios.post(BASE_URL, data, { withCredentials: true });
};

const updateCategory = async (id, data) => {
  return await axios.put(`${BASE_URL}/${id}`, data, { withCredentials: true });
};

const deleteCategory = async (id) => {
  return await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
};

export const categoryService = {
  getAllCategories,
  getAllCategoriesforproducts,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
