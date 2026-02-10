const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash("error", "you need to login first");
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        const user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        req.user = user;
        next(); // ✅ VERY IMPORTANT
    } catch (err) {
        req.flash("error", "something went wrong.");
        return res.redirect("/");
    }
};