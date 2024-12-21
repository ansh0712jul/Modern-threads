const { productSchema , reviewSchema } = require("../models/Joi.models");

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
        return res.render("error.js");
    }
    next();
}

module.exports = { validateProduct, validateReview }