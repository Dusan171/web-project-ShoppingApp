import { v4 as uuidv4 } from 'uuid';
import * as reviewRepository from '../repositories/reviewRepository.js';
import * as productRepository from '../repositories/productRepository.js';
import * as userRepository from '../repositories/userRepository.js';
import Review from '../models/review.js';

export const createReview = (reviewData, authorId) => {
    const { ocjena, komentar, productId, receiverId } = reviewData;

    const product = productRepository.default.getProductById(productId);
    if (!product) {
        throw new Error("Proizvod nije pronađen.");
    }
    if (product.status !== 'Sold') {
        throw new Error("Možete ocijeniti samo kupovine koje su završene (status 'Sold').");
    }
    if (String(product.kupacId) !== String(authorId)) {
        throw new Error("Ne možete ocijeniti proizvod koji niste kupili.");
    }
    if (String(product.prodavacId) !== String(receiverId)) {
        throw new Error("Pokušavate ocijeniti pogrešnog prodavca.");
    }
    if (reviewRepository.findByProductIdAndAuthorId(productId, authorId)) {
        throw new Error("Već ste ocijenili ovu kupovinu.");
    }

    const newReview = new Review(
        uuidv4(),
        ocjena,
        komentar,
        productId,
        authorId,
        receiverId,
        new Date().toISOString()
    );

    return reviewRepository.save(newReview);
 
};
export const getAllReviews = () => {
    const reviews = reviewRepository.findAll();
    const users = userRepository.findAll();

    const usersMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});

    const populatedReviews = reviews.map(review => {
        const author = usersMap[review.authorId];
        const receiver = usersMap[review.receiverId];

        return {
            ...review,
            authorUsername: author ? author.korisnickoIme : 'Nepoznat',
            receiverUsername: receiver ? receiver.korisnickoIme : 'Nepoznat'
        };
    });

    return populatedReviews;
};

export const updateReview = (reviewId, newComment) => {
    const review = reviewRepository.findById(reviewId); 
    if (!review) {
        throw new Error("Recenzija nije pronađena.");
    }
    review.komentar = newComment;
    return reviewRepository.save(review);
};

export const deleteReview = (reviewId) => {
    const success = reviewRepository.deleteById(reviewId); 
    if (!success) {
        throw new Error("Recenzija nije pronađena za brisanje.");
    }
    return { message: "Recenzija uspješno obrisana." };
};