// // import axios from "axios";

// // const BASE_URL = `http://localhost:3000/cart`;

// // export const cartService = {
// //   getCart: async (userId) => {
// //     const res = await axios.get(`${BASE_URL}/get/${userId}`);
// //     return res.data; // Assuming successResponse returns { data: [...] }
// //   },

// //   removeProduct: async (userId, productId) => {
// //     const res = await axios.delete(`${BASE_URL}/remove/${userId}/${productId}`);
// //     return res.data;
// //   },

// //   updateQuantity: async (userId, productId, quantity) => {
// //     const res = await axios.put(`${BASE_URL}/update-quantity/${userId}/${productId}`, { quantity });
// //     return res.data;
// //   }
// // };

// import axios from "axios";

// const BASE_URL = `http://localhost:3000/api/v1/cart`;

// /**
//  * Cart Services to handle all communication with the Shopping Cart Backend
//  */
// export const cartService = {
//   // 1. GET: Fetch all products in the user's cart
//   getCart: async (userId) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/get/${userId}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       return { data: [] };
//     }
//   },

//   // 2. POST: Add a new product to the cart
//   addToCart: async (userId, productId) => {
//     try {
//       const res = await axios.post(`${BASE_URL}/add/${userId}/${productId}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       throw error;
//     }
//   },

//   // 3. PUT: Increment quantity ('+' button)
//   incrementItem: async (userId, productId) => {
//     try {
//       const res = await axios.put(`${BASE_URL}/increment/${userId}/${productId}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error incrementing item:", error);
//       throw error;
//     }
//   },

//   // 4. PUT: Decrement quantity ('-' button)
//   decrementItem: async (userId, productId) => {
//     try {
//       const res = await axios.put(`${BASE_URL}/decrement/${userId}/${productId}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error decrementing item:", error);
//       throw error;
//     }
//   },

//   // 5. PUT: Manually set a specific quantity (input field)
//   updateQuantity: async (userId, productId, quantity) => {
//     try {
//       const res = await axios.put(`${BASE_URL}/update-quantity/${userId}/${productId}`, { quantity });
//       return res.data;
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//       throw error;
//     }
//   },

//   // 6. DELETE: Remove a specific product (Trash icon)
//   removeProduct: async (userId, productId) => {
//     try {
//       const res = await axios.delete(`${BASE_URL}/remove/${userId}/${productId}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error removing product:", error);
//       throw error;
//     }
//   },

//   // 7. DELETE: Empty the entire cart
//   clearCart: async (userId) => {
//     try {
//       const res = await axios.delete(`${BASE_URL}/clear/${userId}`);
//       return res.data;
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       throw error;
//     }
//   }
// };

// import axios from "axios";

// const BASE_URL = `http://localhost:3000/cart`;

// export const cartService = {
//   getCart: async (userId) => {
//     const res = await axios.get(`${BASE_URL}/get/${userId}`);
//     return res.data; // Assuming successResponse returns { data: [...] }
//   },

//   removeProduct: async (userId, productId) => {
//     const res = await axios.delete(`${BASE_URL}/remove/${userId}/${productId}`);
//     return res.data;
//   },

//   updateQuantity: async (userId, productId, quantity) => {
//     const res = await axios.put(`${BASE_URL}/update-quantity/${userId}/${productId}`, { quantity });
//     return res.data;
//   }
// };

import axios from "axios";
import { API_BASE_URL } from "../config";

const BASE_URL = `${API_BASE_URL}/api/v1/cart`;

/**
 * Cart Services to handle all communication with the Shopping Cart Backend
 */
export const cartService = {
  // 1. GET: Fetch all products in the user's cart
  getCart: async (userId) => {
    console.log("user::::::", userId);
    try {
      const res = await axios.get(`${BASE_URL}/get/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return { data: [] };
    }
  },

  // 2. POST: Add a new product to the cart
  addToCart: async (userId, productId) => {
    try {
      const res = await axios.post(`${BASE_URL}/add/${userId}/${productId}`);
      return res.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // 3. PUT: Increment quantity ('+' button)
  incrementItem: async (userId, productId) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/increment/${userId}/${productId}`,
      );
      return res.data;
    } catch (error) {
      console.error("Error incrementing item:", error);
      throw error;
    }
  },

  // 4. PUT: Decrement quantity ('-' button)
  decrementItem: async (userId, productId) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/decrement/${userId}/${productId}`,
      );
      return res.data;
    } catch (error) {
      console.error("Error decrementing item:", error);
      throw error;
    }
  },

  // 5. PUT: Manually set a specific quantity (input field)
  updateQuantity: async (userId, productId, quantity) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/update-quantity/${userId}/${productId}`,
        { quantity },
      );
      return res.data;
    } catch (error) {
      console.log("Error Response Data:", error.response?.data);
      // Use this to see the specific message:
      console.log("Error Message:", error.message);
      console.error("Error updating quantity:", error);
      throw error;
    }
  },

  // 6. DELETE: Remove a specific product (Trash icon)
  removeProduct: async (userId, productId) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/remove/${userId}/${productId}`,
      );
      return res.data;
    } catch (error) {
      console.error("Error removing product:", error);
      throw error;
    }
  },

  // 7. DELETE: Empty the entire cart
  clearCart: async (userId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/clear/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
  placeOrder: async (userId) => {
    try {
      const res = await axios.post(`${BASE_URL}/place-order/${userId}`);
      return res.data;
    } catch (error) {
      console.error("Error placing order", error);
    }
  },
};
