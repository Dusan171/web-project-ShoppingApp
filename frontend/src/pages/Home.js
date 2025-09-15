import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(false), 2500); // nakon 2.5s animacije, skini je
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Slika */}
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

      {/* Naslov */}
      <h1 className={`launch-text ${!animated ? "no-animation" : ""}`}>
        We're launching <br /> soon
      </h1>

      {/* Dugme */}
      <button
        onClick={() => navigate("/products")}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "15px 30px",
          fontSize: "20px",
          border: "2px solid white",
          borderRadius: "8px",
          background: "white",
          color: "black",
          cursor: "pointer",
        }}
      >
        Shop now
      </button>
    </div>
  );
}
