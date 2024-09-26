const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    comment:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});
module.exports=mongoose.model("review",reviewSchema);