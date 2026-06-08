const BASE_URL = `http://localhost:3000/api/v1/inventory`;

// ─── Shared fetch wrapper ──────────────────────────────────────────────────────
const authFetch = (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  return fetch(url, {
    ...options,
    credentials: "include", // ← sends cookie on every request
    headers: isFormData
      ? options.headers // let browser set Content-Type for FormData
      : { "Content-Type": "application/json", ...options.headers },
  });
};

// ─── Query Builder ─────────────────────────────────────────────────────────────
const buildQueryParams = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.categoryname?.trim())
    params.set("categoryname", filters.categoryname.trim());
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.priceMin !== "")
    params.set("discount_price[gte]", String(filters.priceMin));
  if (filters.priceMax !== "")
    params.set("discount_price[lte]", String(filters.priceMax));
  if (filters.ratingMin !== "")
    params.set("rating[gte]", String(filters.ratingMin));

  const stockMap = {
    out: { "stock_quantity[lte]": "0", "stock_quantity[gte]": "0" },
    low: { "stock_quantity[gte]": "1", "stock_quantity[lte]": "50" },
    medium: { "stock_quantity[gte]": "51", "stock_quantity[lte]": "150" },
    high: { "stock_quantity[gte]": "151" },
  };
  if (filters.stockLevel && stockMap[filters.stockLevel]) {
    Object.entries(stockMap[filters.stockLevel]).forEach(([k, v]) =>
      params.set(k, v),
    );
  }

  return params.toString();
};

// ─── Image Upload ──────────────────────────────────────────────────────────────
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await authFetch(`${BASE_URL}/uploadImage`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Image upload failed");
  }

  const json = await res.json();
  return json.data.url;
};

// ─── Products CRUD ─────────────────────────────────────────────────────────────

export const getProducts = async (filters = {}) => {
  const query = buildQueryParams(filters);
  const res = await authFetch(query ? `${BASE_URL}?${query}` : BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return json.data ?? json;
};

export const createProduct = async (productData) => {
  const res = await authFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create product");
  }
  const json = await res.json();
  return json.data ?? json;
};

export const updateProduct = async (id, updateData) => {
  const res = await authFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update product");
  }
  const json = await res.json();
  return json.data ?? json;
};

export const deleteProduct = async (id) => {
  const res = await authFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete product");
  }
  return true;
};
