import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

//Kreiranje Context objekat
const AuthContext = createContext(null);

//Kreiranje "Provider" komponente
//Ona će "omotati" celu aplikaciju i pružati joj podatke o autentifikaciji.
export const AuthProvider = ({ children }) => {
  // 'user' stanje čuva dekodirane podatke o korisniku (npr. { id, uloga, korisnickoIme })
  const [user, setUser] = useState(null);

  // Ovaj useEffect se izvršava samo jednom, kada se aplikacija prvi put učita
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Proveravamo da li je token istekao
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
        } else {
          // Ako je token istekao, brišemo ga
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Funkcija za prijavu
  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  // Funkcija za odjavu
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // Vrednost koju pružamo svim komponentama unutar Provider-a
  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Kreiramo custom hook "useAuth"
// Ovo je prečica da ne bismo morali da uvozimo 'useContext' i 'AuthContext' u svakoj komponenti
export const useAuth = () => {
  return useContext(AuthContext);
};