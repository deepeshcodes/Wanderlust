const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
    
        default: "https://i.pinimg.com/564x/be/64/f6/be64f6185db1de651aad58f3c1cbb037.jpg",

        set: (v) => v === "" 
        ? "https://i.pinimg.com/564x/be/64/f6/be64f6185db1de651aad58f3c1cbb037.jpg"
        : v, 
    },
    price: Number,
    location: String,
    country: String,    
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ]
});

// POST Mongoose Middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;