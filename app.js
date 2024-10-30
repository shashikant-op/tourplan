if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}

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
const userrouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const user=require("./models/user.js");
const passport=require("passport");
const Localstrategy=require("passport-local");
const { register } = require("module");
const {isloggedin}=require("./middleware.js");
const dburl=process.env.MONGOALTAS;
// const cookie=require("cookie");

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:"mysecret",
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("something err in mongostore ", err);
})
const sessionobject={
    store,
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
    mongoose.connect(dburl);
}

app.use(session(sessionobject));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})

app.get("/", (req, res) => {
    res.render("listings/home.ejs");

})
// app.get("/demouser",async(req,res)=>{
//     const fakeuser=new user({
//         email:"shashikantsharma@gmail.com",
//         username:"sharmashashikant",
//     })
//   let registerduser= await user.register(fakeuser,"shashi12@@");
//   res.send(registerduser);

// })

app.use("/listings",listingrouter);
app.use("/listings/:id/review",reviewrouter);
app.use("/",userrouter);


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