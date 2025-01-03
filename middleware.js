const {listingschema,reviewschema}=require("./schemavalidation.js");
const hotellisting = require("./models/hotel-list");
const review=require("./models/review.js");
const Expresserr=require("./utlis/expresserr.js");
module.exports.isloggedin =(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.redirecturl=req.originalUrl;
    req.flash("error","phale login to karlo Bhai!");
     return res.redirect("/login");
}
next();
}
module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
 next();
}
module.exports.isuser=async(req,res,next)=>{
    let {id}=req.params;
    let details=await hotellisting.findById(id);
    if(!details.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","you are not the onwer of this listing");
        return res.redirect(`/listings/show/${id}`);
    }
    else if(res.locals.curruser.username==="opshashi"){
        next();
    }
    else{
        next();
    }
    
    
}
 module.exports.isowner=async(req,res,next)=>{
    let {id ,reviewid}=req.params;
    let reviews=await review.findById(reviewid);
    if(!reviews.author.equals(res.locals.curruser._id)){
        req.flash("error","delete you own review ! haramipan nahi ");
        return res.redirect (`/listings/show/${id}`);
    }
    else if(res.locals.curruser.username==="opshashi"){
        next();
    }
    else{
        next();
    }
    
 }
module.exports.validatelisting=(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserr(400,errmsg);
        
    }
    else{
        next();
    }
}
module.exports.validatereview=(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserr(400,errmsg);
        
    }
    else{
        next();
    }
}