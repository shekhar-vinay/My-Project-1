if (process.env.NODE_ENV != "production"){
  require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// ------------- Acquiring the routes -------------- //

const listRoute = require("./routes/listing.js")
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// ------------------------------------------------- //

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

// Connecting with the DB

main().then(res => console.log('connection successful'))
.catch(err => console.log(err));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, 
  crypto: {
    secret: process.env.SECRET
  }
});

store.on("error", (err) => {
  console.log("error in MONGO SESSION STORE", err)
})

const sessionOptions = { 
  store,
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}


app.use(session(sessionOptions));
app.use(flash());;

app.use(passport.initialize());
app.use(passport.session()); 


passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

 

app.listen(8080,() => {
    console.log("!! - Server Listening - !!")
})

// This variable 'success/error' is available to any middleware and route
//   handler that is defined after this variable is defined. It is also
//   available to any views rendered during the specific request.

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/demouser",wrapAsync(async (req,res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "sigma-student"
//   });

//   let regUSer =  await User.register(fakeUser, "pappu");
//   res.send(regUSer);
// }));

 
app.use("/listings/:id/reviews",reviewRoute);
app.use("/listings",listRoute);
app.use("/user",userRoute);


 

app.all(/(.*)/, (req,res,next) => {
    next(new expressError(404, "Page Not Found"));
})


//---This is an error handling middleware - 
// identification cue : the one with four arguments.
app.use((err,req,res,next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    
    res.status(statusCode).render("error.ejs", { message })
})

//Use Case   | Syntax        | Effect
//Standard   | next()        | Moves to the very next middleware function.
//Route Skip | next('route') | Skips remaining middleware in the current stack for this route.
//Error      | next(err)     | Skips to the dedicated error-handling middleware.