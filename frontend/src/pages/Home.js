import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiSearch, FiHeart, FiShoppingBag, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // 1. UVOZIMO useAuth
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 2. DOHVATAMO user i logout IZ CONTEXTA

  const [animated, setAnimated] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Ako je korisnik ulogovan, ne treba nam animacija "We're launching soon"
    if (user) {
      setAnimated(false);
    } else {
      const timer = setTimeout(() => setAnimated(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [user]); // Efekat se ponovo pokreće ako se 'user' promeni (login/logout)


  const handleLogout = () => {
    logout();
    setMenuOpen(false); // Zatvori meni nakon odjave
    navigate('/login'); // Opciono: preusmeri na login stranicu
  };

  // === GLAVNI PRIKAZ ZA SVE ===
  // Prikazujemo pozadinu i navigaciju uvek
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Pozadinska slika */}
      <img
        src="/mintmade-fashion.png"
        alt="Fashion"
        style={{
          position: "absolute", top: 0, left: 0, width: "100%",
          height: "100%", objectFit: "cover"
        }}
      />

      {/* Tekst gore levo */}
      <div className={`top-left-text ${!animated ? "no-animation" : ""}`}>
        <div>(123) 456 7890</div>
        <div>hello@reallygreatsite.com</div>
      </div>

      {/* Ikonice gore desno (Navigacija) */}
      <div className="icon-bar">
        <button className="icon-btn"><FiSearch /></button>
        <button className="icon-btn"><FiHeart /></button>
        <button className="icon-btn"><FiShoppingBag /></button>

        {/* --- USLOVNI MENI ZA KORISNIKA --- */}
        <div className="user-menu-wrapper">
          <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <FiUser />
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              {user ? (
                // 3a. PRIKAZ ZA ULOGOVANOG KORISNIKA
                <>
                  <div className="menu-user-info">
                    Signed in as: <strong>{user.korisnickoIme}</strong>
                  </div>
                  <Link to="/profile" className="menu-link" onClick={() => setMenuOpen(false)}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="menu-link-button">
                    <FiLogOut style={{ marginRight: '5px' }}/> Sign out
                  </button>
                </>
              ) : (
                // 3b. PRIKAZ ZA GOSTA
                <>
                  <Link to="/login" className="menu-link" onClick={() => setMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/register" className="menu-link" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- USLOVNI SADRŽAJ STRANICE --- */}
      {/* Prikazujemo različit sadržaj u zavisnosti od uloge korisnika */}
      {!user ? (
        // 4a. PRIKAZ ZA GOSTA
        <>
          <h1 className={`launch-text ${!animated ? "no-animation" : ""}`}>
            We're launching <br /> soon
          </h1>
          <button onClick={() => navigate("/products")} className="shop-btn">
            Shop now
          </button>
        </>
      ) : user.uloga === 'Prodavac' ? (
        // 4b. PRIKAZ ZA PRODAVCA
        <div className="dashboard-content">
          <h1>Seller Dashboard</h1>
          <p>Manage your products and view active auctions.</p>
          <button onClick={() => navigate("/add")} className="dashboard-btn">
            Add New Product
          </button>
        </div>
      ) : (
        // 4c. PRIKAZ ZA KUPCA (i sve ostale uloge)
        <div className="dashboard-content">
          <h1>Welcome, {user.korisnickoIme}!</h1>
          <p>Discover amazing products and deals.</p>
          <button onClick={() => navigate("/products")} className="dashboard-btn">
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
}