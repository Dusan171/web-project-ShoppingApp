import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProduct, updateProductStatus, cancelPurchase } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import "../css/product.css";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // ✅ Direktna kupovina
  const handleShopNow = async (productId) => {
    if (!user) {
      alert("You must be logged in to buy!");
      return;
    }

    try {
      await updateProductStatus(productId, "Processing"); // promeni status
      alert("Product is now being processed!");
      loadProduct();
    } catch (err) {
      console.error("Greška pri promeni statusa:", err);
      setError("Failed to update product status.");
    }
  };

  // 🚫 Otkazivanje kupovine
  const handleCancelPurchase = async (productId) => {
    if (!user) {
      alert("You must be logged in to cancel!");
      return;
    }

    try {
      await cancelPurchase(productId);
      alert("Purchase has been canceled!");
      loadProduct();
    } catch (err) {
      console.error("Greška pri otkazivanju:", err);
      setError("Failed to cancel purchase.");
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (!product) return <div className="error-state">Product not found.</div>;

  return (
    <div className="product-details">
      <div className="product-details-image">
        {product.image && (
          <img
            src={product.image.startsWith("http") ? product.image : `/${product.image}`}
            alt={product.name}
          />
        )}
      </div>

      <div className="product-details-info">
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", color: "#222" }}>
          {product.name}
        </h2>

        {product.category && <p className="category">{product.category.name}</p>}

        <p className="price">Price: ${product.price}</p>

        {/* ✅ Ako je aktivan, prikaži Shop Now */}
        {product.salesType === "fixedPrice" && product.status === "Active" && (
          <button className="btn shop-btn" onClick={() => handleShopNow(product.id)}>
            SHOP NOW
          </button>
        )}

        {/* 🚫 Ako je u obradi, prikaži Cancel Purchase */}
        {product.salesType === "fixedPrice" && product.status === "Processing" && (
          <button className="btn cancel-btn" onClick={() => handleCancelPurchase(product.id)}>
            Cancel Purchase
          </button>
        )}

        <p className="description">{product.description}</p>
        {error && <p className="error-message small">{error}</p>}

        {product.status !== "Active" && (
          <div className="sold-badge">
            This item is no longer available ({product.status})
          </div>
        )}
      </div>
    </div>
  );
}
