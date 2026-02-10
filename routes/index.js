const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model")
const isLoggedin = require("../middlewares/isLoggedin")
const userModel = require("../models/user-model")

router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error , loggedin:false});
});

router.get("/shop", isLoggedin, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/cart", isLoggedin, async function (req, res) {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");

    let totalMRP = 0;
    let totalDiscount = 0;

    user.cart.forEach(product => {
        totalMRP += product.price;
        totalDiscount += product.discount || 0;
    });

    let platformFee = user.cart.length > 0 ? 20 : 0;
    let shippingFee = user.cart.length > 0 ? 0 : 0;

    let totalAmount =
        user.cart.length > 0
            ? totalMRP - totalDiscount + platformFee + shippingFee
            : 0;

    res.render("cart", {
        user,
        totalMRP,
        totalDiscount,
        platformFee,
        shippingFee,
        totalAmount
    });
});


router.get("/cart/add/:id", isLoggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    res.redirect("/cart");
});

router.get("/cart/remove/:id", isLoggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    let index = user.cart.indexOf(req.params.id);
    if (index > -1) {
        user.cart.splice(index, 1);
    }

    await user.save();
    res.redirect("/cart");
});


router.get("/addtocart/:productid", isLoggedin, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});


router.get("/logout",isLoggedin,function(req,res){
    res.render("shop");
})

module.exports = router;
