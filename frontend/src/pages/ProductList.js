import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { Link } from "react-router-dom";
import "../css/product.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true); // počinje učitavanje
      const data = await getAllProducts();
      console.log("Fetched products from backend:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // gotovo učitavanje
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadProducts();
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
        {/* Header sekcija */}
        <div className="header-section">
          <h1 className="page-title">Our Products</h1>
          <div className="actions">
            <Link to="/add" className="add-btn">
              ➕ Add Product
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products found</h3>
            <p>Start by adding your first product to the collection.</p>
            <Link to="/add" className="add-btn">
              ➕ Add Product
            </Link>
          </div>
        ) : (
         <ul className="product-grid">
  {products.map((p) => {
              const highestBid = p.ponude?.sort((a, b) => b.cena - a.cena)[0];

              const displayPrice = highestBid ? highestBid.cena : p.price;

              const priceLabel = p.salesType === 'auction' 
                ? (highestBid ? "Current Bid:" : "Starting at:")
                : "Price:";
  
  return(
    <li key={p.id} className="product-card">
      {/* Klik vodi na detalje proizvoda */}
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
          {priceLabel}${displayPrice}</p>
      </Link>

      {/* Akcije ostaju van linka */}
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
    </li>
  );
  })}
</ul>

        )}
      </div>
    </div>
  );
}
