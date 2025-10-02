import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiSearch, FiShoppingBag, FiHome, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "../css/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <button className="icon-btn" onClick={() => navigate("/")}>
        <FiHome />
      </button>
      <button className="icon-btn">
        <FiSearch />
      </button>
      <button className="icon-btn">
        <FiShoppingBag />
      </button>

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

                {user.uloga === "Prodavac" && (
                  <Link to="/carts" className="menu-link" onClick={() => setMenuOpen(false)}>
                    Cart Seller
                  </Link>
                )}

                <Link to="/profile" className="menu-link" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>

                <button onClick={handleLogout} className="menu-link-button">
                  <FiLogOut /> Sign out
                </button>
              </>
            ) : (
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
  );
}
