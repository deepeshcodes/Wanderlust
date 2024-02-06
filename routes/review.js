const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

//Validation for Review(Middleware)
const validateReview = async (req,res,next) => {

    try{
        const {review} = req.body;

        // if(!review || !review.rating || !review.comment){
        //     throw new ExpressError(400, "Both rating & comment are required while adding review");
        // }

        if(!review){
            throw new ExpressError(400, "Review object is required");
        }

        if(!review.rating){
            throw new ExpressError(400, "Review rating is required");  
        }

        // Validate rating range (1 to 5)
        const minRating = 1;
        const maxRating = 5;
        if (review.rating < minRating || review.rating > maxRating) {
            throw new ExpressError(400, `Review rating should be between ${minRating} and ${maxRating}`);
        }

        if(!review.comment){
            throw new ExpressError(400, "Review comment is required");  
        }


        // Skip schema validation if custom validation passes
            await reviewSchema.validate(review, {abortEarly: false});

        // await reviewSchema.validate(req.body);
        next();
        
    } catch(err) {
        if(err.details && err.details.length > 0){
        const errorMsg = err.details[0].message;
        return res.status(400).send(errorMsg);
        } 
        else {
            // return next(new ExpressError(400, "Invalid review format"));
            return next(err);
        }
    }
};


// Post Review Route
router.post("/",validateReview,  wrapAsync (async (req,res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");

    console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route

router.delete("/:reviewId", wrapAsync(async (req,res) => {
    let {id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   let deletedReview = await Review.findByIdAndDelete(reviewId);

   req.flash("success", "Review Deleted!");
   console.log(deletedReview);  

    res.redirect(`/listings/${id}`);
}));

module.exports = router;