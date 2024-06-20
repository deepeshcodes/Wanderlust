const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

router.route("/")
.get(
   wrapAsync(
      listingController.index)
   )
.post(
   isLoggedIn,
   upload.single('listing[image]'),
    validateListing,
     wrapAsync(listingController.createListing)
     );

router.get("/search", wrapAsync(listingController.searchListing));

 //New Route
 router.get("/new", isLoggedIn, listingController.renderNewForm);

 router.route("/:id")
 .get(wrapAsync (listingController.showListing))
 .put(
   isLoggedIn,
   isOwner,
   upload.single('listing[image]'),
   validateListing,
   wrapAsync (listingController.updateListing)
   )
 .delete(isLoggedIn, isOwner, wrapAsync (async (req,res) => {
   let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log("Deleted Listing:");
   console.log(deletedListing);
   req.flash("success", "Listing Deleted!");
   res.redirect("/listings");
}));
 
 //Edit Route
 router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync (async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    console.log(`Edit Route - Listing ID: ${id}, Listing:`, listing);

    if(!listing){
       req.flash("error", "The listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));
                    
 module.exports = router;