const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index= async(req,res)=>{
    let listing=await Listing.find({})
    // console.log(listing);
    res.render("listings/index.ejs",{listing});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/newList.ejs");
};

module.exports.showListing= async (req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id)
    .populate({path:"reviews",
     populate:{path:"author",
        select: 'username' 
     },
    })
    .populate("owner");
    // console.log(list);
    if(!list){
        
        req.flash("error","listing u are trying to get does not exist");
      return   res.redirect("/listings");
    }
    res.render("listings/list.ejs",{list});
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
        req.flash("error","listing u are trying to get does not exist");
        res.redirect("/listings");
    }
    let originalurl=list.image.url;
    originalurl.replace("/upload","/upload/h_200,w_250");
    
    res.render("listings/edit.ejs",{list,originalurl});
}

module.exports.saveNewListing=async(req,res,next)=>{

   let response= await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    })
    .send()

   let url=req.file.path;
   let fileName=req.file.filename;
   
    const newList=new Listing(req.body.listing);
    newList.owner=req.user._id;
    newList.image={url,fileName};
    newList.geometry=response.body.features[0].geometry; 
    let ans=await newList.save();
    // console.log(ans);
    req.flash("success","New Listing created");
    res.redirect("/listings");


}

module.exports.editListingFinal= async(req,res)=>{
    let {id}=req.params;
     let updated=await Listing.findByIdAndUpdate(id,{...req.body.listing});
if( req.file){
     let url=req.file.path;
   let fileName=req.file.filename;
   updated.image={url,fileName};
   await updated.save();
}
     req.flash("success","listing udated");
     res.redirect(`/listings/${id}`);
}

module.exports.destroyListing= async(req,res)=>{
    let {id}=req.params;

     await Listing.findByIdAndDelete(id);
     req.flash("success","listing deleted");
    
    res.redirect("/listings");
}