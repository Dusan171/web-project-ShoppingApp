import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reviewsFilePath = path.join(__dirname, '..', 'data', 'reviews.json');

const readReviews = () => {
    try {
        const data = fs.readFileSync(reviewsFilePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) { 
        console.error("Error reading reviews.json:", error);
        return []; }
};

const writeReviews = (reviews) => {
      try {
        fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing to reviews.json:", error);
    }
};
export const findById = (id) => {
    const reviews = readReviews();
    return reviews.find(review => review.id === id);
};
export const findAll = () => {
    return readReviews();
};

export const findByProductIdAndAuthorId = (productId, authorId) => {
    return readReviews().find(r => r.productId === productId && r.authorId === authorId);
};

export const save = (reviewToSave) => {
     const reviews = readReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewToSave.id);

    if (reviewIndex !== -1) {
        reviews[reviewIndex] = reviewToSave; 
    } else {
        reviews.push(reviewToSave); 
    }

    writeReviews(reviews);
    return reviewToSave;
};
export const deleteById = (id) => {
    let reviews = readReviews();
    const initialLength = reviews.length;
    reviews = reviews.filter(r => r.id !== id);

    if (reviews.length < initialLength) {
        writeReviews(reviews);
        return true; 
    }
    return false; 
};