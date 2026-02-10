const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




module.exports.registerUser = async function (req, res) {
    try {
        const { email, fullname, password } = req.body;

        // ✅ Validate inputs FIRST
        if (!fullname || fullname.trim().length < 3) {
            req.flash("error", "Full name must be at least 3 characters");
            return res.redirect("/");
        }

        if (!email || !password) {
            req.flash("error", "All fields are required");
            return res.redirect("/");
        }

        // ✅ Check existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            req.flash("error", "Already registered");
            return res.redirect("/");
        }

        // ✅ Hash password
        bcrypt.genSalt(10, function (err, salt) {
            if (err) throw err;

            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) throw err;

                const user = await userModel.create({
                    email,
                    fullname: fullname.trim(),
                    password: hash,
                });

                const token = generateToken(user);
                res.cookie("token", token);

                req.flash("success", "Account created successfully");
                return res.redirect("/");
            });
        });
    } catch (err) {
        console.log(err.message);
        req.flash("error", "Something went wrong");
        return res.redirect("/");
    }
};


module.exports.loginUser=async function (req,res) {
    let{email,password}=req.body;

    let user =await userModel.findOne({email:email});
    if (!user) {
        req.flash("error", "Email or Password incorrect");
        return res.redirect("/");
    }
    bcrypt.compare(password,user.password,function(err,result){
        if(result){
           let token= generateToken(user);
            res.cookie("token",token)
            res.redirect("/shop")
        }
        else{
            req.flash("error", "Email or Password incorrect");
            res.redirect("/");
        }
    })
}
