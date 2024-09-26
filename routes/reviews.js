const express=require("express");
const router=express.Router({mergeParams:true});
const hotellisting = require("../models/hotel-list");
const wrapasync=require("../utlis/wrapasync.js");
const Expresserr=require("../utlis/expresserr.js");
const {listingschema,reviewschema}=require("../schemavalidation.js");
const review=require("../models/review.js");
const mongoose=require("mongoose");

//review validation
const validatereview=(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserr(400,errmsg);
        
    }
    else{
        next();
    }
}

// / review 
// /post route

router.post("/",validatereview,wrapasync(async(req,res)=>{
   
    let listing=await hotellisting.findById(req.params.id);
    let newReview=new review(req.body.review);
   listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review created !");
    res.redirect(`/listings/show/${listing._id}`);
   

  
    
}));
//review delete 

router.delete("/:reviewid",wrapasync(async(req,res)=>{
    let{id,reviewid}=req.params;
    await hotellisting.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/show/${id}`);
}))

module.exports=router;