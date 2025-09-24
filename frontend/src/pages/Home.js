import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [animated, setAnimated] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setAnimated(false);
    } else {
      const timer = setTimeout(() => setAnimated(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const handleBrowseClick = () => {
  if (!user) {
    navigate("/products"); // gost
  } else if (user.uloga === "Prodavac") {
    navigate("/products"); // prodavac sada takođe ide na /products
  } else {
    navigate("/products"); // kupac
  }
};


  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Pozadinska slika */}
      <img
        src="/mintmade-fashion.png"
        alt="Fashion"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Tekst gore levo */}
      <div className={`top-left-text ${!animated ? "no-animation" : ""}`}>
        <div>(123) 456 7890</div>
        <div>hello@reallygreatsite.com</div>
      </div>

      {/* Ikonice gore desno */}
      <div className="icon-bar">
        <button className="icon-btn">
          <FiSearch />
        </button>
        <button className="icon-btn">
          <FiHeart />
        </button>
        <button className="icon-btn">
          <FiShoppingBag />
        </button>

        {/* Dropdown meni za korisnika */}
        <div className="user-menu-wrapper">
          <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <FiUser />
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              {user ? (
                <>
                  <div className="menu-user-info">
                    Signed in as: <strong>{user.korisnickoIme}</strong>
                  </div>

                  {/* ✅ Samo za prodavca */}
                  {user.uloga === "Prodavac" && (
                    <Link
                      to="/my-products"
                      className="menu-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Products
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="menu-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>

                  <button onClick={handleLogout} className="menu-link-button">
                    <FiLogOut style={{ marginRight: "5px" }} /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="menu-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="menu-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sadržaj stranice */}
      <div className="dashboard-content">
        {user ? (
          <h1>
            Welcome, {user.korisnickoIme}!{" "}
            <small>({user.uloga})</small>
          </h1>
        ) : (
          <h1 className={`launch-text ${!animated ? "no-animation" : ""}`}>
            We're launching <br /> soon
          </h1>
        )}

        <p>
          {user?.uloga === "Prodavac"
            ? "Manage your products and view active auctions."
            : "Discover amazing products and deals."}
        </p>

        {/* ✅ Dugme koje vodi na različite stranice */}
        <button onClick={handleBrowseClick} className="dashboard-btn">
          Browse Products
        </button>
      </div>
    </div>
  );
}
