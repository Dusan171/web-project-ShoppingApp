import React, { useEffect, useState } from "react";
import { getCartItems, updateCartItem } from "../services/cartItemService";
import { getAllProducts } from "../services/productService";
import "../css/cartSeller.css";

const CartSeller = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      const items = await getCartItems();
      const products = await getAllProducts();
      
      const mergedItems = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          productName: product ? product.name : "Unknown Product"
        };
      });

      setCartItems(mergedItems.filter(item => item.status === 'IN_PROGRESS'));
    };
    loadItems();
  }, []);

  const approve = async (id) => {
    try {
      await updateCartItem(id, { status: "approved" });
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to approve item:", err);
    }
  };

  const reject = async (id) => {
    try {
      await updateCartItem(id, { status: "rejected" });
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to reject item:", err);
    }
  };

  return (
    <div className="table-container">
      <h2>Cart Items</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td>{item.productName}</td>
              <td>{item.cartId}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => approve(item.id)}>Aprove</button>
                <button onClick={() => reject(item.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cartItems.length === 0 && <p className="empty">No items in cart.</p>}
    </div>
  );
};

export default CartSeller;
