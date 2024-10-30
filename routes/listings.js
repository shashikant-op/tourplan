const express=require("express");
const router=express.Router();
const hotellisting = require("../models/hotel-list");
const wrapasync=require("../utlis/wrapasync.js");
const Expresserr=require("../utlis/expresserr.js");
const reviews =require("../models/review.js");
const mongoose=require("mongoose");
const {isloggedin,isuser ,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudinary.js");
const upload = multer({ storage });
//listing valdation


//main route
//index route
router.get("/", wrapasync(listingcontroller.index))
//show route
router.get("/show/:id", wrapasync(listingcontroller.show))


//new route

router.get("/new",isloggedin, listingcontroller.new)

//create route
router.post("/create",upload.single("listing[image]"),validatelisting,wrapasync(listingcontroller.newlistingform))

//edit route
router.get("/edit/:id",isloggedin,isuser, wrapasync(listingcontroller.editlisting))
//update route

router.put("/update/:id",isuser,upload.single("listing[image]"), validatelisting, wrapasync(listingcontroller.updatelisting));
//delete route
router.delete("/:id",isloggedin,isuser, wrapasync(listingcontroller.deletelisting))
module.exports=router;