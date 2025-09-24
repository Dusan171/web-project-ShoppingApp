// src/pages/ProductTabs.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../services/productService";
import "../css/product.css";
import { getCartItems } from "../services/cartItemService";
 

export default function ProductTabs() {
  const [tab, setTab] = useState("all");
  const [allProducts, setAllProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAllProducts();
    if (user?.uloga === "Prodavac") {
      loadMyProducts();
    }
  }, []);

  async function loadAllProducts() {
    try {
      setLoading(true);
      const data = await getAllProducts();

      const cartItems = await getCartItems();

      const cartItemIds = new Set(cartItems.map(item => item.productId));

      const filteredProducts = data.filter(product => !cartItemIds.has(product.id));

       setAllProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyProducts() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch my products");
      const data = await res.json();

      // 👉 backend vraća `prodavacId`, ne `sellerId`
      const filtered = data.filter((p) => p.prodavacId === user.id);

      setMyProducts(filtered);
    } catch (error) {
      console.error("Error fetching my products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadAllProducts();
      if (user?.uloga === "Prodavac") {
        loadMyProducts();
      }
    }
  }

  const renderProducts = (products, showAddBtn = true, isMine = false) => {
    if (loading) return <div className="loading">Loading products...</div>;

    if (products.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          {isMine ? (
            <>
              <h3>Nema proizvoda koje ste vi kreirali</h3>
              <p>Dodajte svoj prvi proizvod.</p>
              <Link to="/add" className="add-btn">
                ➕ Add Product
              </Link>
            </>
          ) : (
            <>
              <h3>No products found</h3>
              {showAddBtn && (
                <>
                  <p>Start by adding your first product to the collection.</p>
                  <Link to="/add" className="add-btn">
                    ➕ Add Product
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      );
    }

    return (
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

              {user?.uloga === "Prodavac" && (
                <div className="card-actions">
                  <button
                    className="delete-btn small"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                  <Link className="btn small" to={`/edit/${p.id}`}>
                    Edit
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

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
          <h1 className="page-title">Products</h1>

          {/* Tabs */}
          <div style={{ marginTop: "20px" }}>
           

            {user?.uloga === "Prodavac" && (
              <button
                onClick={() => setTab("my")}
                style={{
                  padding: "10px 20px",
                  fontWeight: tab === "my" ? "bold" : "normal",
                }}
              >
                My Products
              </button>
            )}
          </div>

          {tab === "all" && (
            <div className="actions">
              <Link to="/add" className="add-btn">
                ➕ Add Product
              </Link>
            </div>
          )}
        </div>

        {tab === "all"
          ? renderProducts(allProducts, true, false)
          : renderProducts(myProducts, false, true)}
      </div>
    </div>
  );
}
