import * as userService from '../services/userService.js';


export const getMyProfile = async (req, res) => {
    try {
        // ID korisnika ne čitamo iz URL-a (radi sigurnosti), već
        // direktno iz tokena koji je 'protect' middleware proverio i dekodirao.
        const userId = req.user.id;

        // Pozivamo servis da dohvati podatke za taj ID
        const userProfile = userService.getUserProfile(userId);
        
        // Šaljemo profil kao JSON odgovor
        res.json(userProfile);
    } catch (error) {
        // Ako servis baci grešku (npr. korisnik nije nađen), hvatamo je
        res.status(404).json({ message: error.message });
    }
};
