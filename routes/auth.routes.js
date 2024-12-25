const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User.models");
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_SECRET_API);

 




// Route to show the registration form
router.get("/register", (req, res) => {
  res.render("auth/signup");
});

// Route to register a new user
router.post("/register", async (req, res) => {
  const { email, password,username,role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already taken!");
      return res.redirect("/register");
    }
    const newUser = new User({ email,username,role });
    await User.register(newUser, password); 
    req.flash("success", "Registration successful! You are now logged in.");
    // res.redirect("/login"); ek baar signup krne k baad apne aap login ho jaaana chhaiye 

    req.login(newUser, (err) =>{
      if(err) {
        return next(err);
      }
      req.flash("success", "Registration successful! You are now logged in.");
      return res.redirect("/products");
    })
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
  }), (req, res) => {

    console.log('email sent')
     sendThankYouEmail(req.user.email);
    res.redirect("/products");
});

// logout 
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).render("error.ejs",{err:err.message}) // If there's an error logging out, pass it to the error handler
    }
    req.flash("success", "You have been logged out.");
    res.redirect("/login");
  });
});


//sendgrid emial functions 
function sendThankYouEmail(userEmail) {
  const msg = {
    to: userEmail,  // User's email address
    from: 'ansh.agrawal1_cs22@gla.ac.in',  
    subject: 'Thank you for visiting our website!',
    text: 'We appreciate you checking out our website. Thank you for visiting us!',
    html: '<strong>We appreciate you checking out our website. Thank you for visiting us!</strong>',
  };

  sgMail.send(msg)
}


module.exports = router;
