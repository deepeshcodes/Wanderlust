const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.searchFilters = async (req, res) => {
    const category = req.query.category;
    console.log("Filter category: ", category);

    if(!category || !Listing.schema.path('category').enumValues.includes(category)) {
      req.flash("error", "Invalid category selected");
      return res.redirect("/listings");
    }

    const listings = await Listing.find({ category: category});

    if(listings.length === 0) {
      req.flash("error", `No listings found for the ${category}`);
    }

    res.render("listings/index.ejs", {allListings: listings});
} 

module.exports.searchListings = async (req, res) => {
  const  q  = req.query.search;
  //console.log("search: ",q);
  //console.log("req.query: ",req.query);
  if (!q || q.trim() === "") {
    req.flash("error", "Please enter something to search!");
    return res.redirect("/listings");
  }

  const query = { title: { $regex: new RegExp(q, "i") } };
  const listings = await Listing.find(query);

  if (listings.length === 0) {
    req.flash("error", "No listings found for your search query");
  }

  res.render("listings/index.ejs", { allListings: listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  newListing.category = req.body.listing.category;

  console.log(Listing.schema.path('category').enumValues);

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
  } catch(error) {
      next(error);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  console.log(`Edit Route - Listing ID: ${id}, Listing:`, listing);

  if (!listing) {
    req.flash("error", "The listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  listing.image.url = listing.image.url.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  try {
  if(typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url, filename};
  }

  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send();

  listing.geometry = response.body.features[0].geometry;
  listing.category = req.body.listing.category; 

  await listing.save();
  console.log(`Update Route - Listing ID: ${id}, Listing:`, listing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);

    } catch (error) {
      console.error(error);
      req.flash("error","Failed to update the listing!")
      res.redirect(`/listings/${id}/edit`);
    }

};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
