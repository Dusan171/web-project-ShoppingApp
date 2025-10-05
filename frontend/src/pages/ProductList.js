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
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filters, setFilters] = useState({
    priceFrom: "",
    priceTo: "",
    salesType: "",
    categoryId: "",
    location: "",
  });

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

  // Filtriranje proizvoda po searchTerm i dodatnim filterima
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriceFrom = !filters.priceFrom || parseFloat(p.price) >= parseFloat(filters.priceFrom);
    const matchesPriceTo = !filters.priceTo || parseFloat(p.price) <= parseFloat(filters.priceTo);
    const matchesSalesType = !filters.salesType || p.salesType === filters.salesType;
const matchesCategory = !filters.categoryId || String(p.categoryId) === String(filters.categoryId);
const matchesLocation =
  !filters.location || (
    p.location &&
    (
      (p.location.street && p.location.street.toLowerCase().includes(filters.location.toLowerCase())) ||
      (p.location.city && p.location.city.toLowerCase().includes(filters.location.toLowerCase()))
    )
  );

    return matchesSearch && matchesPriceFrom && matchesPriceTo && matchesSalesType && matchesCategory && matchesLocation;
  });

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

          {/* Polje za pretragu */}
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "10px 15px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
          />

          {/* Filteri */}
          <div className="filters" style={{ marginBottom: "20px" }}>
            <input
              type="number"
              placeholder="Price from"
              value={filters.priceFrom}
              onChange={(e) => setFilters({...filters, priceFrom: e.target.value})}
              style={{ marginRight: "10px", padding: "5px", width: "100px" }}
            />
            <input
              type="number"
              placeholder="Price to"
              value={filters.priceTo}
              onChange={(e) => setFilters({...filters, priceTo: e.target.value})}
              style={{ marginRight: "10px", padding: "5px", width: "100px" }}
            />
            <select
              value={filters.salesType}
              onChange={(e) => setFilters({...filters, salesType: e.target.value})}
              style={{ marginRight: "10px", padding: "5px" }}
            >
              <option value="">All sales types</option>
              <option value="fixedPrice">Fixed Price</option>
              <option value="auction">Auction</option>
            </select>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({...filters, categoryId: e.target.value})}
              style={{ marginRight: "10px", padding: "5px" }}
            >
              <option value="">All categories</option>
              <option value="1">Electronics</option>
              <option value="2">Clothing</option>
              <option value="3">Furniture</option>
              <option value="4">Shoes</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              style={{ marginRight: "10px", padding: "5px", width: "150px" }}
            />
          </div>

          {user && isSeller && (
            <div className="actions">
              <button className="add-btn" onClick={handleAddClick}>
                ➕ Add Product
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No products found</h3>
            {isSeller && <p>Try adding a new product!</p>}
          </div>
        ) : (
          <ul className="product-grid">
            {filteredProducts.map((p) => {
              const highestBid = p.ponude?.sort((a, b) => b.cena - a.cena)[0];
              const displayPrice = highestBid ? highestBid.cena : p.price;
              const priceLabel =
                p.salesType === "auction"
                  ? highestBid
                    ? "Current Bid:"
                    : "Starting at:"
                  : "Price:";

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
