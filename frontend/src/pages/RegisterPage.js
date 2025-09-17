import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/auth.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    korisnickoIme: '',
    email: '',
    lozinka: '',
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
        // Preusmeravamo na stranicu za prijavu nakon uspešne registracije
        navigate('/login');
      } else {
        setError(data.message || 'Došlo je do greške pri registraciji.');
      }
    } catch (err) {
      setError('Nije moguće povezati se sa serverom.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleRegister}>
          {/* Dodajemo polja za ime, prezime, email... */}
          <div className="form-group">
            <label htmlFor="ime">Ime</label>
            <input type="text" id="ime" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="prezime">Prezime</label>
            <input type="text" id="prezime" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="korisnickoIme">Korisničko ime</label>
            <input type="text" id="korisnickoIme" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" className="form-input" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lozinka">Lozinka</label>
            <input type="password" id="lozinka" className="form-input" onChange={handleChange} required />
          </div>
          <button type="submit" className="auth-btn">
            Registruj se
          </button>
        </form>
        <p className="switch-auth-link">
          Već imaš nalog? <Link to="/login">Prijavi se</Link>
        </p>
      </div>
    </div>
  );
}