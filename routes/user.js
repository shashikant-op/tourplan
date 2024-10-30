const express=require("express");
const router=express.Router();
const user=require("../models/user");
const wrapasync = require("../utlis/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware");

router.get("/signup",(req,res)=>{
   res.render("./listings/users/signup");
})
router.post("/signup",wrapasync(async(req,res)=>{
   try{
      let{email,username,password}=req.body;
   const newuser= new user({email,username});
   const registerduser=await user.register(newuser,password);
  console.log(registerduser);
  req.login(registerduser,(err,next)=>{
   if(err){
      return next(err);
   }
   req.flash("success",`welcome to wonderlust Mr. ${username}`);
   res.redirect("/");
  })
 
   }
   catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
   }
   

}))

router.get("/login",(req,res)=>{
   res.render("./listings/users/login.ejs");
})
router.post("/login",saveredirecturl,
   passport.authenticate(
      "local",
   {failureRedirect:"/login",
      failureFlash:true,
   }),
   async(req,res)=>{
      req.flash("success","welcome Back!");
      let redirecturl=res.locals.redirecturl ||"/listings";
      res.redirect(redirecturl);
})

router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
      if(err){
       return next(err);
      }
      req.flash("success","you logged out!");
      res.redirect("listings");
   });
   
})
module.exports=router;