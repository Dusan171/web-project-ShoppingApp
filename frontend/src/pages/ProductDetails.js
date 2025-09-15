import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/productService";
import "../css/product.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error("Error loading product:", error);
      }
    }
    loadProduct();
  }, [id]);

  if (!product) {
    return <div className="loading">Loading product details...</div>;
  }

  return (
    <div className="product-details">
      {/* Leva polovina (slika full height/width) */}
      <div className="product-details-image">
        {product.image && (
          <img
            src={product.image.startsWith("http") ? product.image : `/${product.image}`}
            alt={product.name}
          />
        )}
      </div>

      {/* Desna polovina (info centriran) */}
      <div className="product-details-info">
<h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", color: "#222" }}>
  {product.name}
</h2>

        {product.category && <p className="category">{product.category.name}</p>}
        <p className="price">${product.price}</p>
        <p className="description">{product.description}</p>

        <button className="btn shop-btn">SHOP NOW</button>
      </div>
    </div>
  );
}
