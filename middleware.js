const listing = require("./models/listing.js");
const review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");


module.exports.isLoggedIn = function(req,res,next) {
    // console.log(req.path,"...",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // redirectUrl is a new property that has been added 
        req.flash("error","You must be logged in!!!");
        return res.redirect("/user/login");
    };
    next();
} 


module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};



module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    // let editedUSer = req.body.listing;
    let ogListing = await listing.findById(id);
    if(!ogListing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have the neccessary permissions!!");
        return  res.redirect(`/listings/${id}`);
    };
    next()
};



module.exports.validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map( el => el.message).join(","); 
      throw new expressError(400, errMsg)
    }else{
      next()
    }
};



module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map( el => el.message).join(","); 
      throw new expressError(400, errMsg);
    }else{
      next()
    }
}



module.exports.isAuthor = async (req,res,next) => {
    let { id, reviewId } = req.params;
    // let editedUSer = req.body.listing;
    let ogReview = await review.findById(reviewId);
    if(!ogReview?.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have the neccessary permissions!!");
        return  res.redirect(`/listings/${id}`);
    };
    next()
};