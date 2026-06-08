const BASE_URL = `http://localhost:3000/api/v1/orders`; // ← also fix port, your backend is 3001

// ─── shared helper so we don't repeat credentials everywhere ─────────────────
const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    credentials: "include", // ← sends the cookie on every request
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

// ─── Customer API Calls ───────────────────────────────────────────────────────

export const getMyOrders = async () => {
  const res = await authFetch(`${BASE_URL}`);
  if (!res.ok) throw new Error("Failed to fetch your orders");
  const json = await res.json();
  console.log(json);

  return json.data ?? json;
};

export const getOrderById = async (id) => {
  const res = await authFetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order details");
  const json = await res.json();
  return json.data ?? json;
};

export const cancelMyOrder = async (id) => {
  const res = await authFetch(`${BASE_URL}/${id}/cancel`, { method: "PATCH" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to cancel order");
  }
  const json = await res.json();
  return json.data ?? json;
};

// ─── Admin API Calls ──────────────────────────────────────────────────────────

export const getAllOrders = async () => {
  const res = await authFetch(`${BASE_URL}/admin/all`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const json = await res.json();
  return json.data ?? json;
};

export const acceptOrder = async (id) => {
  const res = await authFetch(`${BASE_URL}/admin/${id}/accept`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to accept order");
  }
  const json = await res.json();
  return json.data ?? json;
};

export const rejectOrder = async (id) => {
  const res = await authFetch(`${BASE_URL}/admin/${id}/reject`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to reject order");
  }
  const json = await res.json();
  return json.data ?? json;
};

export const updateOrderStatus = async (id, status) => {
  const res = await authFetch(`${BASE_URL}/admin/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update order status");
  }
  const json = await res.json();
  return json.data ?? json;
};
