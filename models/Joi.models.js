const joi = require("joi");

const productSchema = joi.object({
    name: joi.string().required(),
    price: joi.string().required(),
    img: joi.string().required(),
    desc: joi.string().required()
})

const reviewSchema= joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
})

module.exports = { productSchema , reviewSchema}