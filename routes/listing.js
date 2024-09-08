const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const controller=require("../controllers/listing.js");

const multer=require("multer");
const {storage}=require("../cloudconfig.js")
const upload=multer({storage});


router
.route("/")
.get(wrapAsync(controller.index))
.post(
    upload.single('listing[image]'),
    validateListing ,
    wrapAsync(controller.saveNewListing));








router.get("/new",isLoggedIn,controller.renderNewForm)



router
.route("/:id")
.get(wrapAsync(controller.showListing))
.put(isOwner,upload.single('listing[image]'),validateListing,wrapAsync(controller.editListingFinal))
.delete(isLoggedIn,isOwner, wrapAsync( controller.destroyListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( controller.editListing));





module.exports=router;
