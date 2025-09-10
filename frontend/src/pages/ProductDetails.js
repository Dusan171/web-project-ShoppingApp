import React, { useEffect, useState } from "react";
import { getProduct } from "../services/productService";
import { useParams, Link } from "react-router-dom";
import "../css/product.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    const data = await getProduct(id);
    setProduct(data);
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="card product-details">
        <div className="card-header">Product Details</div>
        <div className="card-body">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Category:</strong> {product.category?.name}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Sales Type:</strong> {product.salesType}</p>
          <Link className="btn" to="/">⬅ Back</Link>
        </div>
      </div>
    </div>
  );
}
