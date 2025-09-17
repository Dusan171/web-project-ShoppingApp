import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: "Korisnik uspešno registrovan", userId: user.id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { token } = await authService.login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};