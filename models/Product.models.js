const mongoose = require("mongoose");
const Review = require("./Review.models");


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
    avgRating:{
        type:Number,
        default:0
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

// middleware to delete reviews when product is deleted
productSchema.post("findOneAndDelete", async function (product) {
    if (product && product.reviews.length > 0) {
        // Delete reviews only if product exists and has reviews
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});


let Product = mongoose.model("Product",productSchema);
module.exports = Product