const API_URL = "http://localhost:5000/api/products";

export async function getAllProducts() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function createProduct(product, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,   // 👈 DODAJ
    },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id, product, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,   // 👈 DODAJ
    },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function deleteProduct(id, token) {
  const res = await fetch(`${API_URL}/${id}`, { 
    method: "DELETE",
    headers: { 
      Authorization: `Bearer ${token}`,   // 👈 DODAJ
    },
  });
  return res.json();
}
