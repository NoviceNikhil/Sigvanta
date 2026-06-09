import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/v1/dashboard/stats`;

const getDashboardStats = async () => {
  const response = await axios.get(BASE_URL);
  const { data } = response.data; // unwrap apiResponse.successResponse shape

  console.log("dvfdf", data);

  return {
    stats: {
      totalOrders: data.totalOrders,
      totalSales: data.totalSales,
      totalProducts: data.totalProducts,
      totalUsers: data.totalUsers ?? null, // not available yet
    },
    recentOrders: data.recentOrders,
    recentProducts: data.recentProducts,
    recentUsers: data.recentUsers ?? [], // not available yet
  };
};

export default { getDashboardStats };
