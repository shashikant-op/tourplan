const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate);
app.use(methodoverride("_method"));
const wrapasync=require("./utlis/wrapasync.js");
const Expresserr=require("./utlis/expresserr.js");
const listingrouter=require("./routes/listings.js");
const reviewrouter=require("./routes/reviews.js");
const session=require("express-session");
const flash=require("connect-flash");
// const cookie=require("cookie");

const sessionobject={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxage:7*24*60*60*1000,
        httponly:true,
    }
}

app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

main().then((res) => {
    console.log("connected");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/hotel-list');
}

app.use(session(sessionobject));
app.use(flash());




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.get("/", (req, res) => {
    res.render("listings/home.ejs");

})

app.use("/listings",listingrouter);
app.use("/listings/:id/review",reviewrouter);


app.use("*", (req, res, next) => {
    next(new Expresserr(404, "Page not found"));  // Use 404 for not found errors
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).render("error.ejs", { err });
});

// Server listening on port 8080
app.listen(8080, () => {
    console.log("App is listening on port 8080");
});