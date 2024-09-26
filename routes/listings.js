const express=require("express");
const router=express.Router();
const hotellisting = require("../models/hotel-list");
const wrapasync=require("../utlis/wrapasync.js");
const Expresserr=require("../utlis/expresserr.js");
const {listingschema,reviewschema}=require("../schemavalidation.js");
const review=require("../models/review.js");
const mongoose=require("mongoose");

//listing valdation

const validatelisting=(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserr(400,errmsg);
        
    }
    else{
        next();
    }
}
//main route
//index route
router.get("/", wrapasync(async (req, res) => {
    const listings = await hotellisting.find({});
    res.render("listings/index.ejs", { listings});

}))
//show route
router.get("/show/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    const details = await hotellisting.findById(id).populate("reviews");
    if(!details){
        req.flash("error","listings which you are looking for does not exist!");
        res.redirect("/listings");
    

    }
    res.render("listings/show.ejs", { details});
}))


//new route

router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

//create route
router.post("/create", validatelisting,wrapasync(async (req, res) => {
    const newlisting = new hotellisting(req.body.listing);
    await newlisting.save();
    console.log(req.body.listing);
    req.flash("success","Listing is Created!");
    res.redirect("/listings");


}))
//edit route
router.get("/edit/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    let details = await hotellisting.findById(id);
    if(!details){
        req.flash("error","listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/update.ejs", { details});
}))
//update route

router.put("/update/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    if (!req.body || !req.body.listing) {
        throw new Error("Invalid input data");
    }
    await hotellisting.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Modified!");
   
    res.redirect("/listings");
}));
//delete route
router.delete("/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    await hotellisting.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
}))
module.exports=router;