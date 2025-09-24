import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';

export const protect = (req, res, next) => {
  let token;

  // 1. Proveravamo da li postoji 'Authorization' header i da li počinje sa 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Izdvajamo token iz 'Bearer TOKEN_STRING'
      token = req.headers.authorization.split(' ')[1];

      // 3. Verifikujemo token. Ako je neispravan (npr. istekao), ovaj deo će baciti grešku (error)
      const decoded = jwt.verify(token, 'TVOJA_TAJNA_SIFRA_ZA_TOKEN');
      
      // 4. (Opciono ali dobra praksa) Proveravamo da li korisnik iz tokena i dalje postoji u našoj "bazi"
      const currentUser = userRepository.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 5. Ako je sve u redu, zakačimo dekodirane podatke na 'req' objekat
      // Tako će svaka sledeća funkcija (kontroler) znati ko je ulogovani korisnik
      req.user = { 
  id: decoded.id || decoded.userId, // ✅ uvek postavi id
  ...decoded 
};

      
      // 6. Puštamo zahtev da prođe dalje do kontrolera
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Ako uopšte nema tokena u headeru
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};