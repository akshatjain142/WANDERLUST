const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    const updateList=await Listing.findById(id);
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    updateList.reviews.push(newReview);
    await updateList.save();
    await newReview.save();

    req.flash("success","New Review Created");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    const review=await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};