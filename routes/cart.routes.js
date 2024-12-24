const express = require("express");
const User = require("../models/User.models");
const { isLoggedIn } = require("../middlewares/validation.middleware");
const Product = require("../models/Product.models");
const router = express.Router();

// Get cart details
router.get("/user/cart", async (req, res) => {
    let user = await User.findById(req.user._id).populate("cart.product"); // Populate the product data
    res.render("cart/index.ejs", { user });
});

// Add a product to the cart
router.post("/user/:productId/add", isLoggedIn, async (req, res) => {
    let { productId } = req.params;
    let userId = req.user._id;
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    
    // Check if the product already exists in the cart
    let existingProduct = user.cart.find(item => item.product.toString() === productId);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity
    } else {
        user.cart.push({ product: productId, quantity: 1 }); // Add new product to cart
    }
    
    await user.save();
    res.redirect("/user/cart");
});

// Increase product quantity in the cart
router.post("/user/:productId/increase", isLoggedIn, async (req, res) => {
    let { productId } = req.params;
    let user = await User.findById(req.user._id);
    
    // Find the product in the user's cart
    let productInCart = user.cart.find(item => item.product.toString() === productId);
    
    if (productInCart) {
        productInCart.quantity += 1;
    }
    
    await user.save();
    res.redirect("/user/cart");
});

// Decrease product quantity in the cart
router.post("/user/:productId/decrease", isLoggedIn, async (req, res) => {
    let { productId } = req.params;
    let user = await User.findById(req.user._id);
    
    // Find the product in the user's cart
    let productInCart = user.cart.find(item => item.product.toString() === productId);
    
    if (productInCart && productInCart.quantity > 1) {
        productInCart.quantity -= 1;
    } else {
        // If quantity is 1, delete the product from the cart
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
    }
    
    await user.save();
    res.redirect("/user/cart");
});

// Delete product from the cart
router.delete("/user/:productId/delete", isLoggedIn, async (req, res) => {
    let { productId } = req.params;
    let user = await User.findById(req.user._id);

    // Remove the product from the cart
    user.cart = user.cart.filter(item => item.product.toString() !== productId);

    await user.save();
    res.redirect("/user/cart");
});

// Clear the entire cart
router.delete("/user/cart/clear", isLoggedIn, async (req, res) => {
    let user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.redirect("/products");
});

module.exports = router;
