import * as reviewService from '../services/reviewService.js';

export const postReview = (req, res) => {
    try {
        const authorId = req.user.id; 
        const newReview = reviewService.createReview(req.body, authorId);
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const getAll = (req, res) => {
    try {
        res.json(reviewService.getAllReviews());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const update = (req, res) => {
    try {
        const { komentar } = req.body;
        const updatedReview = reviewService.updateReview(req.params.id, komentar);
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const remove = (req, res) => {
    try {
        const result = reviewService.deleteReview(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};