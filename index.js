const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Productroutes = require("./routes/product.routes.js");
const Reviewroutes = require("./routes/review.routes.js");
const Authroutes = require("./routes/auth.routes.js");
const Cartroutes = require("./routes/cart.routes.js");
const User = require("./models/User.models.js");


mongoose.connect("mongodb://127.0.0.1:27017/Modern-Threads")
  .then(() => {
      console.log("Database connected successfully 🥳🥳!!!");
  })
  .catch((err) => {
      console.log(err);
      console.log("Database connection error!!!");
  });

// Session configuration
const configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    Cookie:{
        httpOnly: true,
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
};

// Set up the view engine
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(session(configSession));
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serving static files


// Passport setup
app.use(passport.initialize());  // Initialize Passport
app.use(passport.session());  // Handle session for Passport

passport.serializeUser(User.serializeUser());  // Serialize user to session
passport.deserializeUser(User.deserializeUser());  // Deserialize user from session
passport.use(new localStrategy(User.authenticate()));  // Use local strategy for authentication

// Setting locals for views
app.use((req, res, next) => {
    // console.log("Current User:", req.user);  // Debug log
    res.locals.currentUser = req.user;  // Set currentUser in the local view data
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Route handlers
app.use(Productroutes);
app.use(Reviewroutes);
app.use(Authroutes);
app.use(Cartroutes);

// Start the server
app.listen(8088, () => {
    console.log("Server is listening on port localhost:8088");
});
