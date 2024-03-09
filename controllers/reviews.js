const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req,res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    console.log("new review saved");
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");


    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req,res) => {
    let {id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
   let deletedReview = await Review.findByIdAndDelete(reviewId);

   req.flash("success", "Review Deleted!");
   console.log("Deleted Review:");
   console.log(deletedReview);  

    res.redirect(`/listings/${id}`);
};