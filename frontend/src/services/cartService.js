const API_URL = "http://localhost:5000/api/carts";

export async function getCarts() {
  const res = await fetch(API_URL);
  return res.json();
}


export async function createCart(cart) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });
  return res.json();
}


export async function getCart(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}


export async function getCartByUserId(userId) {
  const res = await fetch(`${API_URL}/${userId}`);
  return res.json();
}


export function calculateTotal(cart, products) {
  return cart.items.reduce((sum, item) => {
    const product = products[item.productId];
    if (!product) return sum; 
    return sum + product.price * item.quantity;
  }, 0);
}
