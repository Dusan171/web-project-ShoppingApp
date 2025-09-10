import React, { useEffect, useState } from "react";
import { createProduct, getProduct, updateProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useNavigate, useParams } from "react-router-dom";
import "../css/product.css";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    salesType: "fixedPrice"
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct();
    }
  }, [id]);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function loadProduct() {
    const data = await getProduct(id);
    setForm(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (id) {
      await updateProduct(id, form);
    } else {
      await createProduct(form);
    }
    navigate("/");
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">{id ? "Edit Product" : "Add Product"}</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label>Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Sales Type</label>
              <select
                value={form.salesType}
                onChange={(e) => setForm({ ...form, salesType: e.target.value })}
              >
                <option value="fixedPrice">Fixed Price</option>
                <option value="auction">Auction</option>
              </select>
            </div>
            <button type="submit" className="btn">{id ? "Update" : "Create"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
