import React, { useEffect, useState } from "react";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found, user not logged in");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/products/my", {   // 👈 promenjeno sa /mine na /my
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
        console.log("✅ My products:", data);
        setProducts(data);
      })
      .catch((err) => console.error("❌ Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Products</h2>
      {products.length === 0 ? (
        <p>You haven't added any products yet.</p>
      ) : (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.image && <img src={p.image} alt={p.naziv} width="100" />}
              <h3>{p.naziv}</h3> {/* 👈 backend vraća "naziv", ne "name" */}
              <p>Status: {p.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyProducts;
