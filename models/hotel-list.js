const { types } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js");

const hotel_listSchema =new Schema({
   title:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true,
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
     },
   image:{
    filename:String,
    url:String,
   },
   reviews:[{
      type:Schema.Types.ObjectId,
      ref:"review",
   }],
   owner:{
      type:Schema.Types.ObjectId,
      ref:"user",
   }
   

   
})
const hotellisting=mongoose.model("hotellisting",hotel_listSchema);
module.exports=hotellisting;