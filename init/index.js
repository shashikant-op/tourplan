const mongoose=require("mongoose");
const initdata=require("./data");
const Listing=require("../models/hotel-list");

main().then((res)=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/hotel-list');
}

const initdb=async()=>{
    await Listing.deleteMany({});
    const initData = initdata.data.map((obj)=>({ ...obj,owner:'6708750c4661b8d8c6ed0c18'}));
    await Listing.insertMany(initData);
    console.log("datawas initialized");
    
}
initdb();