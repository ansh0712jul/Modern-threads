const express = require("express");
const Review = require("../models/Review.models");
const router = express.Router();
const Product = require("../models/Product.models");
const { validateReview, isLoggedIn } = require("../middlewares/validation.middleware")

router.post("/products/:id/review", validateReview,isLoggedIn, async(req,res) =>{
    try{
        let { id }= req.params;
        let {rating, comment}= req.body;
        let product = await Product.findById(id);
        let review=await Review.create({rating,comment});
        product.reviews.push(review);

        await review.save();
        await product.save();
        req.flash("success","Review added succesfully")
        res.redirect(`/products/${id}`);
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    

})

router.delete("/products/:id/delete/:reviewId", isLoggedIn, async(req,res) => {
    let { id , reviewId } = req.params;
    let product = await Product.findById(id);
    let review = await Review.findById(reviewId);

    // use filter method to make new review array without that review 
    product.reviews= product.reviews.filter( rev => !rev.equals(review._id))
    await product.save()
    console.log("review deleted successfully in array ")
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if(!deletedReview){
        req.flash("error","Review not found");
        return res.redirect(`/products/${id}`)
    }
    req.flash("error","review deleted successfully")
    res.redirect(`/products/${id}`)
})

module.exports = router