import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiSearch, FiHeart, FiShoppingBag } from "react-icons/fi";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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
        <button className="icon-btn"><FiSearch /></button>
        <button className="icon-btn"><FiHeart /></button>
        <button className="icon-btn"><FiShoppingBag /></button>

        {/* Ikonica korisnika + meni */}
        <div className="user-menu-wrapper">
          <button className="icon-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <FiUser />
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              <Link to="/login" className="menu-link" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" className="menu-link" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Naslov */}
      <h1 className={`launch-text ${!animated ? "no-animation" : ""}`}>
        We're launching <br /> soon
      </h1>

      {/* Dugme za shop */}
      <button onClick={() => navigate("/products")} className="shop-btn">
        Shop now
      </button>
    </div>
  );
}
