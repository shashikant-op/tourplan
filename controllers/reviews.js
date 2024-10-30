const hotellisting=require("../models/hotel-list");
const review=require("../models/review");

module.exports.reviewpost = async(req,res)=>{
   
    let listing=await hotellisting.findById(req.params.id);
    let newReview=new review(req.body.review);
   listing.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    await listing.save();
    req.flash("success","Review created !");
    res.redirect(`/listings/show/${listing._id}`);
    
}
module.exports.reviewdelete = async(req,res)=>{
    let{id,reviewid}=req.params;
    await hotellisting.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/show/${id}`);
}
