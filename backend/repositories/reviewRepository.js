import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reviewsFilePath = path.join(__dirname, '..', 'data', 'reviews.json');

const readReviews = () => {
    try {
        const data = fs.readFileSync(reviewsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) { return []; }
};

const writeReviews = (reviews) => {
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf8');
};
export const findAll = () => readReviews();

export const findByProductIdAndAuthorId = (productId, authorId) => {
    return readReviews().find(r => r.productId === productId && r.authorId === authorId);
};

export const save = (review) => {
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