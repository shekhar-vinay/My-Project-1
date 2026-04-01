const mongoose = require("mongoose");
const review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url : String,
        filename : String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review" 
        } 
    ],
    owner : {
        type:mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

listingSchema.post("findOneAndDelete",async (list) => {
    if(list){
        await review.deleteMany({_id : {$in : list.reviews}});
    }
})

const listing = mongoose.model("listing",listingSchema);

module.exports = listing;