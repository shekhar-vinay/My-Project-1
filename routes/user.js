const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const { signupForm, createNewUser, loginUser, logoutUser } = require("../controllers/user.js");


router.route("/signup")
    .get(signupForm)
    .post(wrapAsync(createNewUser));




router.route("/login")
    .get((req,res) => { res.render("users/login.ejs")} )
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/user/login', failureFlash: true}), loginUser);



//Log Out
router.get("/logout", logoutUser);


module.exports = router;