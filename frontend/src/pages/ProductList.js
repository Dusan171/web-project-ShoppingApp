import React, { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../css/product.css";

export default function ProductList() {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSeller = user && user.uloga === "Prodavac";

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddClick() {
    if (!isSeller) {
      alert("Samo prodavac može dodavati proizvode!");
      return;
    }
    navigate("/add");
  }

  async function handleDelete(productId) {
    if (window.confirm("Da li ste sigurni da želite da obrišete proizvod?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to delete product");
        }
        alert("Product deleted successfully!");
        loadProducts();
      } catch (err) {
        console.error(err);
        alert("Error deleting product: " + err.message);
      }
    }
  }

  return (
    <div
      className="products-page"
      style={{
        backgroundImage: "url('/background-products.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundColor: "rgba(0,0,0,0.3)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="container">
        <div className="header-section">
          <h1 className="page-title">Our Products</h1>
          <div className="actions">
            {user && isSeller && (
              <button className="add-btn" onClick={handleAddClick}>
                ➕ Add Product
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products found</h3>
            <p>Start by adding your first product to the collection.</p>
          </div>
        ) : (
          <ul className="product-grid">
            {products.map((p) => {
              const highestBid = p.ponude?.sort((a, b) => b.cena - a.cena)[0];
              const displayPrice = highestBid ? highestBid.cena : p.price;
              const priceLabel =
                p.salesType === "auction"
                  ? highestBid
                    ? "Current Bid:"
                    : "Starting at:"
                  : "Price:";

              // Samo vlasnik proizvoda vidi dugmad
              const isOwner = isSeller && String(user?.id) === String(p.prodavacId);

              return (
                <li key={p.id} className="product-card">
                  <Link
                    to={`/products/${p.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {p.image ? (
                      <img
                        src={p.image.startsWith("http") ? p.image : `/${p.image}`}
                        alt={p.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">🛍</div>
                    )}

                    <h3>{p.name}</h3>
                    <p className="product-price">
                      {priceLabel} ${displayPrice}
                    </p>
                  </Link>

                  {isOwner && (
                    <div className="product-actions">
                      <button
                        className="btn edit-btn"
                        onClick={() => navigate(`/edit-product/${p.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn delete-btn"
                        style={{ marginLeft: "10px", backgroundColor: "crimson", color: "white" }}
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
