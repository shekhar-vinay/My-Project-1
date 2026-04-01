const User = require("../models/user.js");

module.exports.signupForm = (req,res) => {
    res.render("users/signup.ejs");
};


module.exports.createNewUser = async (req,res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if(err) {
                next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        });
        
    } catch(e) {
        // req.flash("error", e.message);
        console.log(e); 
    }
};


module.exports.loginUser = async(req,res) => {
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}; 


module.exports.logoutUser = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        };
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};