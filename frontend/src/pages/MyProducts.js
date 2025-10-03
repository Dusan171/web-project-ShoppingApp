import React, { useEffect, useState } from "react";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funkcija za učitavanje proizvoda korisnika
  const loadProducts = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user not logged in");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/products/my", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        // Proizvodi sa statusom "Sold" ili "approved" se ne prikazuju
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Funkcija za odobravanje proizvoda
  const approveProduct = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cart-items/${productId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to approve product");

      // Nakon approve, logički obriši proizvod sa stranice
      setProducts((prev) => prev.filter((p) => p.id !== productId));

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Products</h2>
      {products.length === 0 ? (
        <p>You haven't added any products yet.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id} style={{ marginBottom: "20px" }}>
              {p.image && <img src={p.image} alt={p.name} width="100" />}
              <h3>{p.name}</h3>
              <p>Status: {p.status}</p>
              <button onClick={() => approveProduct(p.id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyProducts;
