const mongoose=require("mongoose");

const hotel_listSchema =new mongoose.Schema({
   title:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true,
   },
   image:{
    type:String,
    default:"https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?cs=srgb&dl=dug-out-pool-hotel-pool-1134176.jpg&fm=jpg",
    set:(v) =>
        v===""
        ?"https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?cs=srgb&dl=dug-out-pool-hotel-pool-1134176.jpg&fm=jpg"
        :v,
   },
   price:{
    type:Number,
    required:true,
   },
   location:{
    type:String,
   },
   country:{
    type:String,
    required:true,
   }

   
})
const hotellisting=mongoose.model("hotellisting",hotel_listSchema);
module.exports=hotellisting;