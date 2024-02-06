const mongoose = require('mongoose');
const Review = require('./models/review.js');

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

const reviewIdsToDelete = [
    '65b2a384d6eda487ee09a85b',
];

async function deleteReviews() {
    try{
        for(const reviewId of reviewIdsToDelete) {
            await Review.findByIdAndDelete(reviewId);
            console.log(`Review with Id ${reviewId} deleted successfully`);
        }
    } catch(err) {
        console.error(`Error deleting reviews: ${err.message}`);
    } finally {
        mongoose.connection.close();
    };
};

deleteReviews();