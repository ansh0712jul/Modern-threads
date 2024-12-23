const express = require("express");
const User = require("../models/User.models");
const { isLoggedIn } = require("../middlewares/validation.middleware");
const Product = require("../models/Product.models");
const router = express.Router();

router.get("/user/cart",async(req,res)=>{
    let user = await User.findById(req.user._id).populate("cart");
    res.render("cart/index.ejs",{user});
})

router.post("/user/:productId/add",isLoggedIn,async(req,res) =>{
    let { productId } = req.params;
    let  userId   = req.user._id;
    let product = await Product.findById(productId);
    let user = await User.findById(userId)
    console.log(user)
    user.cart.push(product);
    await user.save();
    res.redirect("/user/cart");
})

module.exports = router ;