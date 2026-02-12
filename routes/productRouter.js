const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const isLoggedin = require("../middlewares/isLoggedin");
const isOwner = require("../middlewares/isOwner");

// ADMIN PAGE
router.get("/admin", isLoggedin, isOwner, function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

// CREATE PRODUCT
router.post("/create", upload.single("image"), async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });

        req.flash("success", "Product created successfully.");
        res.redirect("/products/admin");

    } catch(err){
        res.send(err.message);
    }
});

module.exports = router;
