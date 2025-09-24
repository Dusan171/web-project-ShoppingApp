const API_URL = "http://localhost:5000/api/products";

// 📦 Svi proizvodi
export async function getAllProducts() {
  const res = await fetch(API_URL);
  return res.json();
}

// 📦 Jedan proizvod
export async function getProduct(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

// ➕ Kreiranje proizvoda (prodavac)
export async function createProduct(product, token) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // mora token
    },
    body: JSON.stringify(product),
  });
  return res.json();
}

// ✏️ Ažuriranje proizvoda
export async function updateProduct(id, product, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return res.json();
}

// ❌ Logičko brisanje proizvoda
export async function deleteProduct(id, token) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// 🔄 Promena statusa proizvoda (npr. Active → Processing → Completed)
export async function updateProductStatus(productId, status) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${productId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update product status");
  }
  return data;
}

// 🚫 Otkazivanje kupovine (samo ako je status = Obrada / Processing)
export async function cancelPurchase(productId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${productId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to cancel purchase");
  }
  return data;
}
