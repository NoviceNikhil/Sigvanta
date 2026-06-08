import axios from "axios";

const BASE_URL = `http://localhost:3000/api/v1/products`;

const getProducts = async (queryString = "") => {
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  
  // Use URLSearchParams to "read" the limit out of the incoming string
  const params = new URLSearchParams(queryString);
  const limitValue = params.get("limit");
  const limit = limitValue ? parseInt(limitValue) : 100;

  try {
    const res = await axios.get(url);
    
    // Strict data access
    const products = res.data.data.products;
    const resultLength = res.data.data.results;

    // Calculate total pages: (Total / Limit) rounded up
    const num_pages = Math.ceil(resultLength / limit);

    console.log("All products data -----> ", products);

    return {
      data: products,
      num_pages: num_pages
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { 
      data: [], 
      num_pages: 1 
    };
  }
};

export const productService = {
  getProducts,
};