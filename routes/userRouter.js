const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin")
const { registerUser,loginUser,logoutUser} = require("../controller/authController");
const { myprofile } = require("../controller/authController");



router.post("/register",registerUser)

router.post("/login",loginUser)

router.get("/logout", logoutUser);

router.get("/profile", isLoggedin, myprofile);


module.exports = router;