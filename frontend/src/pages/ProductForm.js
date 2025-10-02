import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "../services/productService";
import { useAuth } from "../context/AuthContext"; 

export default function ProductForm() {
  const { user, token } = useAuth(); 
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    salesType: "fixedPrice", 
  });

  const alerted = useRef(false); 

  useEffect(() => {
    if ((!user || user.uloga !== "Prodavac") && !alerted.current) {
      alerted.current = true;
      alert("Only the seller can add or edit products!");
      navigate("/products");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProduct(id);
        setFormData({
          name: product.name,
          description: product.description || "",
          price: product.price,
          image: product.image || "",
          salesType: product.salesType || "fixedPrice",
        });
      } catch (err) {
        console.error("Error loading product", err);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

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
      alert("Something went wrong while storing the product.");
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
          Description:
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
            <option value="fixedPrice">Fixed Price</option>
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
