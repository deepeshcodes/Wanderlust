const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing.js');
const {isLoggedIn} = require('../middleware.js');

//Validation for Schema(Middleware)
const validateListing = async (req,res,next) => {

    try{
        await listingSchema.validate(req.body);
        next();
    } catch(err) {
      const errorMsg = err.details[0].message;
      return res.status(400).send(errorMsg);
    }
};

//Index Route
router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 }));
 
 //New Route
 router.get("/new", isLoggedIn, (req,res) => {
    // console.log(req.user);
     res.render("listings/new.ejs");
 })
 
 //Show Route
 router.get("/:id", wrapAsync (async (req,res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     if(!listing){
        req.flash("error", "The listing you requested for does not exist!");
        res.redirect("/listings");
     }
     res.render("listings/show.ejs",{listing});
 }));
 
 //Create Route
 router.post("/",wrapAsync (validateListing), wrapAsync(async (req,res,next) => {
 
     const newListing = new Listing(req.body.listing);
 
     await newListing.save();
     req.flash("success", "New Listing Created!");
     res.redirect("/listings");  
 
 
     // let {title,description,image,price,location,country} = req.body;
     // OR
 
     // let listing = req.body.listing;
     // console.log(listing);
     // OR
 
         // if(!req.body.listing){
         //     throw new ExpressError(400, "Send valid data for listing!")
         // }
 
         // if(!req.body.listing.title) {
         //    throw new ExpressError(400, "Title is missing!");
         // }
 
         // if(!req.body.listing.description) {
         //     throw new ExpressError(400, "Description is missing!");
         // }
 
         // if(!req.body.listing.location) {
         //     throw new ExpressError(400, "Location is missing!");
         // }
 
 
 }));
 
 //Edit Route
 router.get("/:id/edit", isLoggedIn, wrapAsync (async (req,res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);

     console.log(`Edit Route - Listing ID: ${id}, Listing:`, listing);

     if(!listing){
        req.flash("error", "The listing you requested for does not exist!");
       return res.redirect("/listings");
     }
     res.render("listings/edit.ejs", {listing});
 }));
                    
 //Update Route
 router.put("/:id", isLoggedIn, wrapAsync (validateListing), wrapAsync (async (req,res) => {
 
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     req.flash("success", "Listing Updated!");
     res.redirect(`/listings/${id}`);
 }));
 
 //Delete Route
 router.delete("/:id", isLoggedIn, wrapAsync (async (req,res) => {
     let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "Listing Deleted!");
     res.redirect("/listings");
 }));

 module.exports = router;