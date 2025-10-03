

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