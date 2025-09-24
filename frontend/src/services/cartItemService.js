const API_URL = "http://localhost:5000/api/cart-items";

export async function getCartItems() {
  const res = await fetch(API_URL);
  return res.json();
}


export async function createCartItem(cartItem) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cartItem),
  });
  return res.json();
}


export const updateCartItem = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item");
  }

  return await response.json();
};