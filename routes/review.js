


const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,validateReview,isAuthor}=require("../middleware.js");

const reviewController=require("../controllers/review.js");



router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));

// deleting a review
router.delete("/:reviewId",isAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;