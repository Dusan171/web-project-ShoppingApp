import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductTabs from "./pages/ProductTabs";
import ProductForm from "./pages/ProductForm";  // 👈 dodaj import
import Profile from "./pages/Profile";
import MyProducts from "./pages/MyProducts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductTabs />} />
        <Route path="/profile" element={<Profile />} />
       <Route path="/my-products" element={<MyProducts />} />  // ✅




        {/* 👇 dodaj forme za dodavanje i editovanje proizvoda */}
        <Route path="/add" element={<ProductForm />} />
        <Route path="/edit/:id" element={<ProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;
