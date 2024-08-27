const express = require("express");
const Expresserr = require("./expresserr");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const hotellisting = require("./models/hotel-list");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require('ejs-mate');
app.engine("ejs", ejsMate);
app.use(methodoverride("_method"));


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



//async errhandling

function wrapasync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{
            console.log("wrapasync  is work");
            console.log(err);
            res.send(err);
            next(err);
        })
    }
}



//authentication

const mysql = require("mysql2");



const connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        database: "app",
        password: "Mysql12"

    }
);

let q = `select*from users`;
connection.query(q, (err, result) => {
    if (err) throw err;
    console.log("sucess");
});


//making route
app.get("/", (req, res) => {
    res.render("signup.ejs");
})
app.get("/login", (req, res) => {
    isaunthenticated = false;
    res.render("signin.ejs");


})

app.patch("/", (req, res) => {
    let { mail: email, password: password, username: name, id: id } = req.body;
    console.log(id);
    let q = `insert into users values( "${id}","${name}","${email}","${password}")`;
    connection.query(q, (err, result) => {
        if (err) {
            res.send(err.code);
            console.log(err.code);

        }
        res.render("signin.ejs");

    })
})
let username;
let userid;

let isaunthenticated = false;
app.patch("/login/profile", (req, res) => {
    let { gmail: usermail, userpassword: loginpassword } = req.body;
    let q2 = `select*from users where email="${usermail}" `;

    connection.query(q2, (err, result) => {

        let user = result[0];
        // cheking password 

        let rpassword = result[0].password;
        console.log(rpassword);
        console.log(loginpassword);
        if (rpassword === loginpassword) {
            isaunthenticated = true;
            username = user.name;
            userid = user.id;
            res.redirect("/home");
        } else {
            res.render("wrongpass.ejs");
        }



    })

})


console.log(username);

app.use((req, res, next) => {
    if (isaunthenticated) {
        next();
    }
    else {
        res.redirect("/login");
    }
})

app.get("/logout", (req, res) => {
    isaunthenticated = false;
    res.redirect("/login");
})
app.get("/profile", (req, res) => {
    let q2 = `select*from users where id="${userid}" `;
    connection.query(q2, (err, result) => {
        let user = result[0];
        res.render("welcome.ejs", { user });
    })


})


//main page
app.get("/home", (req, res) => {
    res.render("listings/home.ejs", { username });

})


//index route
app.get("/listings", wrapasync(async (req, res) => {
    const listings = await hotellisting.find({});
    res.render("listings/index.ejs", { listings, username });

}))
//show route
app.get("/listings/show/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    const details = await hotellisting.findById(id);
    res.render("listings/show.ejs", { details, username });
}))
//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs", { username });
})
app.post("/listings", wrapasync(async (req, res) => {
    const newlisting = new hotellisting(req.body.listing);
    await newlisting.save();
    console.log(req.body.listing);
    res.redirect("/listings");


}))
//edit route

app.get("/listings/edit/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    let details = await hotellisting.findById(id);
    res.render("listings/update.ejs", { details, username });
}))
//update route

app.put("/listings/update/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    if (!req.body || !req.body.listing) {
        throw new Error("Invalid input data");
    }
    await hotellisting.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}));
//delete route
app.delete("/listings/:id", wrapasync(async (req, res) => {
    let { id } = req.params;
    await hotellisting.findByIdAndDelete(id);
    res.redirect("/listings");
}))

app.use("*",(req,res)=>{
res.send("page is not found");
})


const handlevalidationerr = (err) => {
    console.log("This was a validation error: please follow the rules");
    console.dir(err);
    return new Error("Validation failed. Please check your input.");
};

//err handling

app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        err = handlevalidationerr(err);
    }
    res.send(err.message);
    next(err); // Make sure to call next() if not ending the response
});



app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send("Something went wrong!");
});

app.listen(8080, () => {

    console.log("app is listning on port 8080");
})