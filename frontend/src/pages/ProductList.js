import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../services/productService";
import { Link } from "react-router-dom";
import "../css/product.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getAllProducts();
    setProducts(data);
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    loadProducts();
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">Products</div>
        <div className="card-body">
          <Link className="btn" to="/create">➕ Add Product</Link>
          <ul className="product-list">
            {products.map((p) => (
              <li key={p.id}>
                <div>
                  <Link to={`/products/${p.id}`}>{p.name}</Link> - {p.category?.name}
                </div>
                <div>
                  <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                  <Link className="btn" to={`/edit/${p.id}`}>Edit</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
