const User=require("../models/user.js");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to wanderlust you are registered!");
        res.redirect("/listings");
        })
        
    } catch (e) {
        req.flash("error", "user with the same username already exists");
        res.redirect("/user/signup")
    }
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wanderlust, you are logged in");
    let redirecturl=res.locals.redirectUrl || "/listings";
    res.redirect(res.locals.redirectUrl);
}

module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}