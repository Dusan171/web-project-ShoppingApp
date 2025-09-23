const API_URL = "http://localhost:5000/api/carts";

export async function getCarts() {
  const res = await fetch(API_URL);
  return res.json();
}


export async function createCart(cart) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}


export async function getCart(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}
