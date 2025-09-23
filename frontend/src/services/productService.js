const API_URL = "http://localhost:5000/api/products";

export async function getAllProducts() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function createProduct(product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return res.json();
}

// Funkcija za slanje nove ponude
export async function placeBidOnProduct(productId, price) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/products/${productId}/bids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ price: price }) // Šalje samo cenu
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to place bid.');
  }
  return data;
}

// Funkcija za završavanje aukcije
export async function endAuctionForProduct(productId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000/api/products/${productId}/end-auction`, {
    method: 'POST', // Ne treba body, server zna ko je prodavac iz tokena
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to end auction.');
  }
  return data;
}
