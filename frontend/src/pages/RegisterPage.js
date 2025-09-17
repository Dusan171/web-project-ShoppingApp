import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/auth.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    Name: '',
    Surname: '',
    Username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'An error occurred during registration.');
      }
    } catch (err) {
      setError('Unable to connect to server.');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Pozadinska slika */}
      <img
        src="/RegisterPageBg.png"
        alt="Register Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Desna polovina ekrana */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end', // sada bliže desnom rubu
          alignItems: 'center',
          paddingRight: '10%',        // smanjeno sa 15% na 5% da pomeri formu udesno
          zIndex: 1,
        }}
      >
        {/* Forma za registraciju */}
        <div
          style={{
            width: '400px',       // fiksna širina forme
            maxHeight: '95vh',    // da stane u ekran
          }}
        >
          <h1 className="auth-title">Create Account</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="ime">Name</label>
              <input type="text" id="ime" className="form-input" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="prezime">Surname</label>
              <input type="text" id="prezime" className="form-input" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="korisnickoIme">Username</label>
              <input type="text" id="korisnickoIme" className="form-input" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" className="form-input" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lozinka">Password</label>
              <input type="password" id="lozinka" className="form-input" onChange={handleChange} required />
            </div>
            <button type="submit" className="auth-btn">
              Register
            </button>
          </form>
          <p className="switch-auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
