const review = require("../models/review.js");
const listing = require("../models/listing.js");


module.exports.postNewReview = async (req,res) => {
  let list = await listing.findById(req.params.id);
  const review1 = new review(req.body.review); 
  review1.author = req.user._id;
  list.reviews.push(review1);

  await review1.save();
  await list.save();

  console.log("New review saved");
  req.flash("success","New Review Created");
  res.redirect(`/listings/${req.params.id}`);
};


module.exports.deleteReview = async (req,res) => {
  await review.findByIdAndDelete(req.params.reviewId);
  await listing.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});
  
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${req.params.id}`);
};