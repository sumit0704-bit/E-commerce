const express = require("express");
const router = express.Router();

const isLoggedin = require("../middlewares/isLoggedin");

const authController = require("../controller/authController");

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

router.get("/profile", isLoggedin, authController.myprofile);

module.exports = router;