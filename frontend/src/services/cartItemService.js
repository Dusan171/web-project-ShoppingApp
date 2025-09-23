const API_URL = "http://localhost:5000/api/cart-items";

export async function getCartItems() {
  const res = await fetch(API_URL);
  return res.json();
}


export async function createCartItem(cartItem) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}