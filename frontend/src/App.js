import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import ProductDetails from "./pages/ProductDetails"; // 👈 dodato
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';

import Navbar from "./pages/Navbar"; 

function App() {
  return (
    <Router>{}
      <Navbar />
      <main>{}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} /> {/* 👈 nova ruta */}
        <Route path="/add" element={<ProductForm />} />
        <Route path="/edit/:id" element={<ProductForm />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </main>
    </Router>
  );
}

export default App;
