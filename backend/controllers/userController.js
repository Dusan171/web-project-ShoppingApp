import * as userService from '../services/userService.js';

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const userProfile = userService.getUserProfile(userId);

        res.json(userProfile);
    } catch (error) {
 
        res.status(404).json({ message: error.message });
    }
};

export const updateBasic = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedProfile = userService.updateBasicProfile(userId, req.body);
        res.json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSensitive = async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedProfile = await userService.updateSensitiveProfile(userId, req.body);
        res.json(updatedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPublicProfileById = (req, res) => {
    console.log(`--- Primljen zahtjev za javni profil ---`);
    console.log(`Traženi userId: ${req.params.userId}`);
    try {
        const { userId } = req.params;
        const publicProfile = userService.getPublicProfile(userId);

         console.log(`✅ Uspješno pronađen profil, šaljem podatke.`);

        res.json(publicProfile);
    } catch (error) {
        console.error(`!!! Greška prilikom dohvaćanja javnog profila: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};