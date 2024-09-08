const Listing = require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req);
   
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must login");
        return res.redirect("/user/login");
        
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        delete req.session.redirectUrl;
    }else{
        res.locals.redirectUrl="/listings"
    }

    next();
}

module.exports.isOwner=async(req,res,next)=>{
    try{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!res.locals.current || !list.owner.equals(res.locals.current._id)){
        req.flash("error","You don't ahve permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}catch(e){
    next(e);
}
}

module.exports.isAuthor=async(req,res,next)=>{
    try{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!res.locals.current ||  !review.author.equals(res.locals.current._id)){
        req.flash("error","You don't ahve permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}catch(err){
    next(err);
}
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errmsg);
    }else{
        next();
    }
     
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

