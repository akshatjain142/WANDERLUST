const Listing = require("../models/listing.js");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
   const category = req.query.category || "All"; 
  res.render("listings/index.ejs", { listings: allListings,category});
};

module.exports.category=async(req,res)=>{
  let {category}=req.params;
  let listings=await Listing.find({category:category});
  res.render("listings/index.ejs",{listings,category});
};

module.exports.newRenderForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    res.locals.error = req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const response=await geocodingClient
    .forwardGeocode({
      query:req.body.listing.location,
      limit:1,
    })
    .send();
 
  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry=response.body.features[0].geometry;
  
  const result = await newListing.save();
  console.log(result);
  req.flash("success", "New Listing Created!!");
  res.redirect("/listings");
};

module.exports.editRenderForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  let orignalImage = listing.image.url;
  orignalImage = orignalImage.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, orignalImage });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const { listing } = req.body;
  let updateListing = await Listing.findByIdAndUpdate(id, listing, {
    runValidators: true,
    new: true,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    await updateListing.save();
  }

  req.flash("success", "Listing Updated ");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted ");
  res.redirect("/listings");
};
