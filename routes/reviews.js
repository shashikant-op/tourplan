const express=require("express");
const router=express.Router({mergeParams:true});
const hotellisting = require("../models/hotel-list");
const wrapasync=require("../utlis/wrapasync.js");
const Expresserr=require("../utlis/expresserr.js");
const {listingschema,reviewschema}=require("../schemavalidation.js");
const review=require("../models/review.js");
const mongoose=require("mongoose");
const { isloggedin ,saveredirecturl,isowner } = require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js");
const {validatereview}=require("../middleware.js");
// /post route
router.post("/",isloggedin,validatereview,wrapasync(reviewcontroller.reviewpost));
//review delete 
router.delete("/:reviewid",isloggedin,isowner,wrapasync(reviewcontroller.reviewdelete))
module.exports=router;