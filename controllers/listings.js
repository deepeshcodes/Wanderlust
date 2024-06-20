const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.searchListings = async (req, res) => {
  const { search } = req.query;

  if (!search || search.trim() === "") {
    req.flash("error", "Please enter something to search!");
    return res.redirect("/listings");
  }

  const query = { title: { $regex: new RegExp(search, "i") } };
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

  // const {search} = req.query;
  // const queryObject = {};

  // if(search) {
  //   queryObject.search = {$regex: search, $options: "i"};
  // }

  // let findListings = Listing.find(queryObject);
  //const allListings = await findListings(queryObject);
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
  newListing.category = new Listing(req.body.category);

  console.log(req.body);

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

  await listing.save();
  console.log(`Update Route - Listing ID: ${id}, Listing:`, listing);
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);

    } catch (error) {
      console.error(error);
    }

};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
