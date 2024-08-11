const express=require("express");
const app =express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const hotellisting=require("./models/hotel-list");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require('ejs-mate');
app.engine("ejs",ejsMate);
app.use(methodoverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

main().then((res)=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/hotel-list');
}
app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})
//test route
// app.get("/listingstest",async(req,res)=>{
//     let samplelisting=new hotellisting({
//         title:"my villa",
//         des:"top view of jungle",
//         price:8900,
//         location:"katihar",
//         country:"india"
//     })
//     await samplelisting.save().then(()=>console.log("listing was saved"));
//     res.send("succesfull");
// })

//index route
app.get("/listings",async(req,res)=>{
  const listings= await hotellisting.find({});
res.render("listings/index.ejs",{listings});
    
})
app.get("/listings/show/:id",async(req,res)=>{
   let {id}=req.params;
    const details =await hotellisting.findById(id);
    res.render("listings/show.ejs",{details});
})
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings",async(req,res)=>{
    const newlisting=new hotellisting(req.body.listing);
    await newlisting.save();
    console.log(req.body.listing);
    res.redirect("/listings");


})
//edit route
app.get("/listings/edit/:id",async(req,res)=>{
    let {id}=req.params;
    let details=await hotellisting.findById(id);
    res.render("listings/update.ejs",{details});
})
//update route

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await hotellisting.findByIdAndUpdate(id,{...req.body});
    res.redirect("/listings");
})
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await hotellisting.findByIdAndDelete(id);
    res.redirect("/listings");
})


app.listen(8080,()=>{
  
    console.log("app is listning on port 8080");
})