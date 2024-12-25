const express = require("express");
const Product = require("../models/Product.models")
const router = express.Router();
const { 
    validateProduct , 
    isLoggedIn ,
    isSeller,
    isAuthor
    } = require("../middlewares/validation.middleware")

    router.get("/products", async (req, res) => {
        try {
            let products = await Product.find({}).populate("reviews");
    
            // Iterate through each product with a for...of loop
            for (let product of products) {
                let avgRating = 0;
    
                // Calculate average rating if reviews exist
                if (product.reviews.length > 0) {
                    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
                    avgRating = totalRating / product.reviews.length;
                }
    
                // Set the avgRating on the product
                product.avgRating = avgRating;
    
                // Save the product after updating avgRating
                await product.save();
            }
            console.log("Products:", products);
    
            // Render updated products
            res.render("products/index.ejs", { products });
    
        } catch (e) {
            // Handle error
            res.status(500).render("error.ejs", { err: e.message });
        }
    });
    
// show form to create a new product 
router.get("/products/new", isLoggedIn, (req,res)=>{
    try{
        res.render("products/new.ejs")
    }
    catch(e){
        res.status(500).render('error.ejs',{err:e.message})
    }
    
})
// make change to db and add the product 
router.post("/products",validateProduct, isLoggedIn,isSeller, async(req,res)=>{
    try{
        let {name,price,img,desc}=req.body;
        await Product.create({name,price,img,desc,author:req.user._id});
        req.flash("success","Product Added Succesfully")
        res.redirect("/products")
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})
// to show a single product
router.get ("/products/:id", isLoggedIn,async(req,res) =>{
    try{
        let { id } = req.params;
        let product=await Product.findById(id).populate("reviews");
        res.render("products/show.ejs",{product,msg:req.flash("msg")}) 
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})

// to show the update form
router.get("/products/:id/edit", isLoggedIn, isSeller,async(req,res)=>{
    try{
        let { id } = req.params;
        let product = await Product.findById(id);
        res.render("products/edit.ejs", {product});
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})

// to update the product
router.patch("/products/:id",validateProduct, isLoggedIn, isSeller, async(req,res)=>{
    try{
        let { id } = req.params;
        let {name,price,img,desc}=req.body;
        await Product.findByIdAndUpdate(id,{name,price,img,desc});
        req.flash("success","Product edited succesfully")
        res.redirect(`/products/${id}`)
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})
// to delete the product 
router.delete("/products/:id", isLoggedIn, isAuthor, async(req,res) =>{
    try{
        let { id } = req.params;
        const product = await Product.findById(id);
        await Product.findByIdAndDelete(id); 
        req.flash("error","Product deleted succesfully")
        res.redirect("/products")
    }
        
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})
module.exports = router