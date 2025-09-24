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
    // authService.login neka vraća i token i user
    const { token, user } = await authService.login(req.body);

    // Vrati token i korisnika (bez lozinke!)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        ime: user.ime,
        prezime: user.prezime,
        korisnickoIme: user.korisnickoIme,
        email: user.email,
        uloga: user.uloga,
        telefon: user.telefon || null
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
