const express = require("express");
const Product = require("../models/Product.models")
const router = express.Router();
const { validateProduct }= require("../middlewares/validation.middleware")

router.get("/products", async(req,res)=>{
    try{
        let products = await Product.find({});
        res.render("products/index.ejs",{products});
    }
    catch(e){
        res.status(500).render("error.ejs",{err:e.message})
    }
    
})
// show form to create a new product 
router.get("/products/new", (req,res)=>{
    try{
        res.render("products/new.ejs")
    }
    catch(e){
        res.status(500).render('error.ejs',{err:e.message})
    }
    
})
// make change to db and add the product 
router.post("/products",validateProduct, async(req,res)=>{
    try{
        let {name,price,img,desc}=req.body;
        await Product.create({name,price,img,desc});
        res.redirect("/products")
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})
// to show a single product
router.get ("/products/:id", async(req,res) =>{
    try{
        let { id } = req.params;
        let product=await Product.findById(id).populate("reviews");
        res.render("products/show.ejs",{product}) 
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})

// to show the update form
router.get("/products/:id/edit", async(req,res)=>{
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
router.patch("/products/:id",validateProduct, async(req,res)=>{
    try{
        let { id } = req.params;
        let {name,price,img,desc}=req.body;
        await Product.findByIdAndUpdate(id,{name,price,img,desc});
        res.redirect(`/products/${id}`)
    }
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})
// to delete the product 
router.delete("/products/:id", async(req,res) =>{
    try{
        let { id } = req.params;
        const product = await Product.findById(id);
        await Product.findByIdAndDelete(id); 
        res.redirect("/products")
    }
        
    catch(err){
        res.status(500).render("error.ejs",{err:err.message})
    }
    
})
module.exports = router