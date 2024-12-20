const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const seedDb = require("./seed.js");

const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Productroutes = require("./routes/product.routes.js");
const Reviewroutes = require("./routes/review.routes.js");


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


app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));// serving static files
app.use(Productroutes);
app.use(Reviewroutes);

app.listen(8088,() =>{
    console.log("server is listening on port localhost:8088");
})