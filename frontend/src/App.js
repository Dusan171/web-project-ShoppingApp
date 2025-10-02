import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductTabs from "./pages/ProductTabs";
import ProductForm from "./pages/ProductForm";
import Profile from "./pages/Profile";
import MyProducts from "./pages/MyProducts";
import ProductDetails from "./pages/ProductDetails";
import CartSeller from "./pages/CartsSeller";
import Navbar from "./pages/Navbar"; 

function App() {
  return (
    <Router>
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductTabs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-products" element={<MyProducts />} />  
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/carts" element={<CartSeller />} />
        <Route path="/add" element={<ProductForm />} />
        <Route path="/edit/:id" element={<ProductForm />} />
       
      

      </Routes>
    </Router>
  );
}

export default App;
