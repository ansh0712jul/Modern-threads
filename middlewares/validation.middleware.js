const { productSchema , reviewSchema } = require("../models/Joi.models");
const Product = require("../models/Product.models");

const validateProduct= (req,res,next) =>{
    let { name, img ,price, desc} =req.body;
    const { error } =productSchema.validate( { name, img ,price, desc} );
    if( error ){
        return res.render("error",{err:error.message});
    }
    next();
}

const validateReview = (req,res,next) =>{
    let { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment });
    if( error ) {
        req.flash("error", error.message);
        return res.redirect(`/products/${req.params.id}`);
        
    }
    next();
}

const isLoggedIn = (req,res,next)=>{
    if( !req.isAuthenticated() ) {
        req.flash("error", "Please login first!");
        return res.redirect('/login')
    }
    next();
}

const isSeller = (req,res,next) =>{
    if( !req.user.role ){
        req.flash("error", "You don't have permission!")
        res.redirect("/products")
    } 
    else if( req.user.role !== "seller" ) {
        req.flash("error", "You don't have permission!")
        res.redirect("/products")
    }
    next();
}

const isAuthor = async(req,res,next) =>{
    let { id } = req.params;
    const product = await Product.findById(id); 
    if(!product.author.equals(req.user._id)){
        req.flash("error", "You don't have permission!")
        return res.redirect("/products")
    } 
    next();
}

module.exports = { validateProduct, validateReview ,isLoggedIn ,isSeller,isAuthor }