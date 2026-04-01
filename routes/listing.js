const express = require("express"); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { index, newListingForm, createListing, showListing, editListingForm, updateListing, removeListing } = require("../controllers/listing.js");


router.route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, validateListing, upload.single("listing[image]"),wrapAsync(createListing));



router.get("/new", isLoggedIn, newListingForm);



router.route("/:id")
  .get(wrapAsync(showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(removeListing));




router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListingForm));


module.exports = router;