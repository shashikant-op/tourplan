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

//authentication

const mysql=require("mysql2");



const connection=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        database:"app",
        password:"Mysql12"

    }
);
//fake data generator

//  generator=()=>{
//   return {
// id: faker.string.uuid(),
   
//   };
// }
// let id =generator().id;
// console.log(id);


let q=`select*from users`;
connection.query(q,(err,result)=>{
    if (err) throw err;
    console.log("sucess");
    
});


//making route
app.get("/",(req,res)=>{
    res.render("signup.ejs");
})
app.get("/login",(req,res)=>{
    isaunthenticated=false;
    res.render("signin.ejs");
   

})

app.patch("/",(req,res)=>{
   let{mail:email,password:password,username:name,id:id}=req.body;
    console.log(id);
    let q=`insert into users values( "${id}","${name}","${email}","${password}")`;
    connection.query(q,(err,result)=>{
        if (err) {
            res.send("something wrong in database: your id is to long");
        }
        res.render("signin.ejs");  
        
    })
})
let username;
let userid;

let isaunthenticated=false;
    app.patch("/login/profile",(req,res)=>{
        let{gmail:usermail,userpassword:loginpassword}=req.body;
        let q2=`select*from users where email="${usermail}" `;
       
        connection.query(q2,(err,result)=>{
          
        let user=result[0];
           // cheking password 
           
           let rpassword=result[0].password;
           console.log(rpassword);
           console.log(loginpassword);
                        if(rpassword===loginpassword){
                            isaunthenticated = true;
                            username=user.name;
                            userid=user.id;
                          res.redirect("/home");
                        }else{
                            res.render("wrongpass.ejs");
                        }
    
           
           
      })
   
     })
   
    
     console.log(username);
     
     app.use((req,res,next)=>{
        if(isaunthenticated){
            console.log("authenticated");
            next();
        }
        else{
            console.log("your pass may be wrong");
           res.redirect("/login");
        }
     })





 

app.get("/logout",(req,res)=>{
    isaunthenticated=false;
    res.redirect("/login");
   
})
app.get("/profile",(req,res)=>{
     let q2=`select*from users where id="${userid}" `;
     connection.query(q2,(err,result)=>{
       let user=result[0];
        res.render("welcome.ejs",{user});
     })

   
})


//main page
app.get("/home",(req,res)=>{
    res.render("listings/home.ejs",{username});
   
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
res.render("listings/index.ejs",{listings,username});
    
})
//show route
app.get("/listings/show/:id",async(req,res)=>{
   let {id}=req.params;
    const details =await hotellisting.findById(id);
    res.render("listings/show.ejs",{details,username});
})
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs",{username});
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
    res.render("listings/update.ejs",{details,username});
})
//update route

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await hotellisting.findByIdAndUpdate(id,{...req.body});
    res.redirect("/listings",{id,username});
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