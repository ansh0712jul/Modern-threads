const express = require("express");
const Product = require("../models/Product.models")
const router = express.Router();

router.get("/products", async(req,res)=>{
    let products = await Product.find({});
    res.render("products/index.ejs",{products});
})
// show form to create a new product 
router.get("/products/new", (req,res)=>{
    res.render("products/new.ejs")
})
// make change to db and add the product 
router.post("/products", async(req,res)=>{
    let {name,price,img,desc}=req.body;
    await Product.create({name,price,img,desc});
    res.redirect("/products")
})
// to show a single product
router.get ("/products/:id", async(req,res) =>{
    let { id } = req.params;
    let product=await Product.findById(id).populate("reviews");
    res.render("products/show.ejs",{product}) 
})

// to show the update form
router.get("/products/:id/edit", async(req,res)=>{
    let { id } = req.params;
    let product = await Product.findById(id);
    res.render("products/edit.ejs", {product});
})

// to update the product
router.patch("/products/:id", async(req,res)=>{
    let { id } = req.params;
    let {name,price,img,desc}=req.body;
    await Product.findByIdAndUpdate(id,{name,price,img,desc});
    res.redirect(`/products/${id}`)
})
// to delete the product 
router.delete("/products/:id", async(req,res) =>{
    let { id } = req.params;
    const product = await Product.findById(id);
    await Product.findByIdAndDelete(id); 
    res.redirect("/products")
})
module.exports = router