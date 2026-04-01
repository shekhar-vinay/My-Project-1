const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

const { postNewReview, deleteReview } = require("../controllers/review.js");


//------------------Post a review--------------------
router.post("/", isLoggedIn, validateReview, wrapAsync(postNewReview)); 


//------------------Delete a review--------------------
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(deleteReview)); 


module.exports = router;
