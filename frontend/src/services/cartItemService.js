const API_URL = "http://localhost:5000/api/cart-items";

export async function getCartItems() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch cart items");
  return res.json();
}

export async function createCartItem(cartItem) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cartItem),
  });
  if (!res.ok) throw new Error("Failed to create cart item");
  return res.json();
}

export const updateCartItem = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update cart item: ${text}`);
  }

  return res.json();
};

export const rejectCartItem = async (id) => {
  const res = await fetch(`${API_URL}/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const error = await res.json();
      throw new Error(error.message || "Failed to reject cart item");
    } else {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }
  }

  return res.json();
};
