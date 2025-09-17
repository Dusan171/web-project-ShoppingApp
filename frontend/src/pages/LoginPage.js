import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/auth.css'; // Uvozimo nove stilove

export default function LoginPage() {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [error, setError] = useState(''); // Stanje za poruku o grešci
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Resetuj grešku pre novog pokušaja

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ korisnickoIme, lozinka }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Preusmeravamo na početnu stranicu nakon uspešne prijave
        navigate('/'); 
      } else {
        // Postavljamo poruku o grešci koju vraća backend
        setError(data.message || 'Došlo je do greške.');
      }
    } catch (err) {
      setError('Nije moguće povezati se sa serverom.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={korisnickoIme}
              onChange={(e) => setKorisnickoIme(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">
            Prijavi se
          </button>
        </form>
        <p className="switch-auth-link">
          Nemaš nalog? <Link to="/register">Registruj se</Link>
        </p>
      </div>
    </div>
  );
}