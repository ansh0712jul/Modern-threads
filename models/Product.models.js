const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim : true,
    },
    price:{
        type:Number,
        required: true,
        
    },
    img:{
        type:String,
        required:true,
        trim:true
    },
    desc:{
        type:String,
        trim:true
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
},{timestamps:true});

let Product = mongoose.model("Product",productSchema);
module.exports = Product