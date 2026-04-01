const listing = require("../models/listing.js");

module.exports.index = async (req,res) => {
    const result = await listing.find({});
    res.render("listings/list.ejs",{ result })
};


module.exports.newListingForm = (req,res) => {
  res.render("listings/form.ejs");
};


module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};


module.exports.showListing = async (req,res) => {
  let { id } = req.params;
  const listingChosen = await listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
  
  if(!listingChosen){
    req.flash("error","Listing you requested for does not exist !!");
    res.redirect("/listings");
  }
  res.render("listings/specific.ejs",{ listingChosen })
};


module.exports.editListingForm = async (req,res) => {
  let { id } = req.params;
  const list = await listing.findById(id);
  if(!list){
    req.flash("error","Listing you requested for does not exist !!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{ list })
};


module.exports.updateListing = async (req,res) => {
  let { id } = req.params;
  let editedUSer = req.body.listing;
  let listing_new = await listing.findByIdAndUpdate( id, editedUSer);

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing_new.image = { url, filename};
    await listing_new.save();
  }

  req.flash("success","Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};


module.exports.removeListing = async (req,res) => {
  let { id } = req.params;
  let del = await listing.findByIdAndDelete(id);
  console.log(del);
  req.flash("success","Listing Deleted");
  res.redirect(`/listings`);
};


