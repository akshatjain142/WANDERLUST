const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(upload.single("listing[image]"),validateListing, wrapAsync(ListingController.createListing));


//New Route
router.get("/new", isLoggedIn, ListingController.newRenderForm);

router.get("/category/:category",ListingController.category)



router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .put(
    isOwner,
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.updateListing)
  )
  .delete(isOwner, isLoggedIn, wrapAsync(ListingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(ListingController.editRenderForm)
);

module.exports = router;
