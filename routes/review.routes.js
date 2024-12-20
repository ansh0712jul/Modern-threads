const express = require("express");
const Review = require("../models/Review.models");
const router = express.Router();
const Product = require("../models/Product.models");

router.post("/products/:id/review",async(req,res) =>{
    let { id }= req.params;
    let {rating, comment}= req.body;
    let product = await Product.findById(id);
    let review=await Review.create({rating,comment});
    product.reviews.push(review);

    await review.save();
    await product.save();
    res.redirect(`/products/${id}`);

})

module.exports = router