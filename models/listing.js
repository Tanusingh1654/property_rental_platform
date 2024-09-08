const mongoose=require("mongoose");
// const Review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");

let listingScema=new mongoose.Schema({
    title:{
        type:String,
        // required:true
    },
    description:String,
    image: {
    url:String,
    fileName:String,
  },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    geometry:{
      type:{
        type:String,
        enum:['Point'],
        
      },
      coordinates:{
        type:[Number],
      
      }
    }

});


listingScema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});;
    console.log("deleted");
  }
})

const Listing=mongoose.model("Listing",listingScema);
module.exports=Listing;