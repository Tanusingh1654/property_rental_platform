if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}
// console.log(process.env);


const express=require("express");
let app=express();
const mongoose=require("mongoose");


const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store");
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// root
app.get("/",(req,res)=>{
    res.render("/listings");
})

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.current=req.user;
    next();
});

app.get("/demoUser",async(req,res)=>{
    let fakeuser=new User({
        email:"student@gmail.com",
        username:"deltaStudent",
    });
    let registeredUser=await User.register(fakeuser,"mypass");
    res.send(registeredUser);
})



app.use("/listings",listingRoute)
app.use("/listings/:id/review",reviewRoute);
app.use("/user",userRoute);
     app.all("*",(err,req,res,next)=>{
        if(err){
        next(new ExpressError(404,"Page Not Found"));
        }
        next()
     })

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="something went wrong"}=err;
    console.log(err)
    res.status(statusCode).render("listings/error.ejs",{message});
})
const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log("Listening to port");
})
