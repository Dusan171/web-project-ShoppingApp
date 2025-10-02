import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    if (user) {
      setAnimated(false);
    } else {
      const timer = setTimeout(() => setAnimated(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleBrowseClick = () => {
    navigate("/products");
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
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

      <div className={`top-left-text ${!animated ? "no-animation" : ""}`}>
        <div>(123) 456 7890</div>
        <div>hello@reallygreatsite.com</div>
      </div>

      <div className="dashboard-content">
        {user ? (
          <h1>
            Welcome, {user.korisnickoIme}! 
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

        <button onClick={handleBrowseClick} className="dashboard-btn">
          Browse Products
        </button>
      </div>
    </div>
  );
}
