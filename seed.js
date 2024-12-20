const mongoose = require("mongoose");
const Product= require("./models/Product.models");

const productArray = [
    {
        name: "T-shirt",
        price: 500,
        img: "https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.webp?a=1&b=1&s=612x612&w=0&k=20&c=6HNVZlF262ellraih8sH6QQBaAA9WYKO17CQ75faV8k=",
        desc: "bhut bhadiya tshirt h bhai lelo plss 🤗"
    },
    {
        name: "macbook",
        price: 150000,
        img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D",
        desc: "apple ki macbook hai bidu lele "
    },
    {
        name: "Rolls royce",
        price: 80000000,
        img: "https://images.unsplash.com/photo-1659644604418-4ce52370c549?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAwfHxyb2xscyUyMHJveWNlfGVufDB8fDB8fHww",
        desc: "8 crore ki rolls royce hai ye toh aukaat k hi bahar h "
    },
    {
        name: "Charter",
        price: 1500000000,
        img: "https://media.istockphoto.com/id/1201481585/photo/charter-flights.webp?a=1&b=1&s=612x612&w=0&k=20&c=DS2KPeNGaLkRDHsqC2SmoR9drFFMqGVbDRdIhvnhgFY=",
        desc: "badi khatarnaak website h bc charter bhi milta h yha "
    },

]

async function seedDb(){
    await Product.insertMany(productArray);
    console.log("Databse seeded successfully 🥳🥳!!!");
}

module.exports = seedDb