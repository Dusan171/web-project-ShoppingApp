import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, 'TVOJA_TAJNA_SIFRA_ZA_TOKEN');
      
      const currentUser = userRepository.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = { 
  id: decoded.id || decoded.userId, 
  ...decoded 
};

      
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.uloga === 'Administrator') {
        next(); // Korisnik je admin, nastavi dalje
    } else {
        res.status(403).json({ message: 'Not authorized as an administrator' }); // 403 Forbidden
    }
};