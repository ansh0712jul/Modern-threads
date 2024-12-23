const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User.models");

// Route to show the registration form
router.get("/register", (req, res) => {
  res.render("auth/signup");
});

// Route to register a new user
router.post("/register", async (req, res) => {
  const { email, password,username } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already taken!");
      return res.redirect("/register");
    }
    const newUser = new User({ email,username });
    await User.register(newUser, password); 
    req.flash("success", "Registration successful! You are now logged in.");
    res.redirect("/login"); // Redirect to login page
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred during registration.");
    res.redirect("/register");
  }
});

// Route to show login page
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");  // Render the login page
  });

// to actually login via db
router.post("/login", passport.authenticate("local",{
    failureRedirect: "/login",   // Redirect back to login on failure
    failureFlash: "Invalid credentials , Please try again!!!"  
  }), (req,res) => {
    let { username } = req.body;
    req.flash("success", `Welcome ${username}! You are now logged in.`);
    res.redirect("/products");
  }
)

// logout 
router.get("/logout", (req, res) => {
  () =>{
    req.logout();
    req.flash("success", "You have been logged out.");
    res.redirect("/login");
  }
})

module.exports = router;
