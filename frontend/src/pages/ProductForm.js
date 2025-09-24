// src/pages/ProductForm.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "../services/productService";

export default function ProductForm() {
  const { id } = useParams(); // ako postoji, edit mode
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "", // 👈 dodato
    price: "",
    image: "",
    salesType: "fixed", // fixed | auction
  });

  const token = localStorage.getItem("token");

  // ako editujemo, dovuci postojeći proizvod
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  async function loadProduct() {
    try {
      const product = await getProduct(id);
      setFormData({
        name: product.name,
        description: product.description || "", // 👈 dodato
        price: product.price,
        image: product.image || "",
        salesType: product.salesType || "fixed",
      });
    } catch (err) {
      console.error("Error loading product", err);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(id, formData, token);
      } else {
        await createProduct(formData, token);
      }
      navigate("/products");
    } catch (err) {
      console.error("Error saving product", err);
    }
  }

  return (
    <div className="form-container">
      <h2>{id ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description: {/* 👈 novo polje */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>

        <label>
          Sales Type:
          <select
            name="salesType"
            value={formData.salesType}
            onChange={handleChange}
          >
            <option value="fixed">Fixed Price</option>
            <option value="auction">Auction</option>
          </select>
        </label>

        <button type="submit" className="btn">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
