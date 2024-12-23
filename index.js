const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const seedDb = require("./seed.js");
const flash = require("connect-flash");
const session = require("express-session")
const passport = require("passport");
const localStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Productroutes = require("./routes/product.routes.js");
const Reviewroutes = require("./routes/review.routes.js");
const Authroutes = require("./routes/auth.routes.js")
const User =  require("./models/User.models.js")

mongoose.connect("mongodb://127.0.0.1:27017/Modern-Threads")
.then( () =>{
    console.log("database connected succesfully 🥳🥳!!!");
})
.catch( (err) =>{
    console.log(err);
    console.log("database connection error!!!")
})

// seeding database
// seedDb();


const configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
   
  }

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(session(configSession));
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));// serving static files

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.use(passport.initialize());// to use powers of passport 
app.use(passport.session()); // to save locally 

// passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));


app.use(Productroutes);
app.use(Reviewroutes);
app.use(Authroutes);


app.listen(8088,() =>{
    console.log("server is listening on port localhost:8088");
})