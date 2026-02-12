const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");

// REGISTER
module.exports.registerUser = async function (req, res) {
    try {
        const { email, fullname, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            req.flash("error", "Already registered");
            return res.redirect("/");
        }

        const ownerExists = await userModel.findOne({ role: "owner" });
        let role = ownerExists ? "user" : "owner";

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {

                const user = await userModel.create({
                    email,
                    fullname,
                    password: hash,
                    role
                });

                const token = generateToken(user);
                res.cookie("token", token);

                return res.redirect("/");
            });
        });

    } catch (err) {
        res.redirect("/");
    }
};

// LOGIN
module.exports.loginUser = async function (req,res) {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
        req.flash("error", "Email or Password incorrect");
        return res.redirect("/");
    }

    bcrypt.compare(password, user.password, function(err, result){
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);

            return res.redirect("/shop");  // 👈 SAME FOR BOTH
        }
        else{
            req.flash("error", "Email or Password incorrect");
            res.redirect("/");
        }
    })
}


// LOGOUT
module.exports.logoutUser = function (req, res) {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.redirect("/");
};

// PROFILE
module.exports.myprofile = async function(req,res){
    let user = await userModel
        .findOne({ email: req.user.email })
        .select("-password");

    res.render("profile", { user });
};

