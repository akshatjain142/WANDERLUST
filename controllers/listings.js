const Listing = require("../models/listing.js");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  const category = req.query.category || "All";

  return res.render("listings/index.ejs", {
    listings: allListings,
    category,
  });
};

// CATEGORY FILTER
module.exports.category = async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });

  return res.render("listings/index.ejs", {
    listings,
    category,
  });
};

// NEW FORM
module.exports.newRenderForm = (req, res) => {
  return res.render("listings/new.ejs");
};

// SHOW LISTING
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  return res.render("listings/show.ejs", { listing });
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  try {
    const geoResponse = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    if (geoResponse.body.features.length > 0) {
      newListing.geometry = geoResponse.body.features[0].geometry;
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    return res.redirect("/listings");

  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing");
    return res.redirect("/listings");
  }
};

// EDIT FORM
module.exports.editRenderForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  let originalImage = listing.image?.url;
  if (originalImage) {
    originalImage = originalImage.replace("/upload", "/upload/w_250");
  }

  return res.render("listings/edit.ejs", {
    listing,
    originalImage,
  });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updatedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (req.file) {
    updatedListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await updatedListing.save();
  }

  req.flash("success", "Listing Updated!");
  return res.redirect(`/listings/${id}`);
};

// DELETE LISTING
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  const deleted = await Listing.findByIdAndDelete(id);

  if (!deleted) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing Deleted!");
  return res.redirect("/listings");
};