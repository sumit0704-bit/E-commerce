const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: String,

    role: {
        type: String,
        enum: ["user", "owner"],
        default: "user"
    },

    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],

    orders: {
        type: Array,
        default: [],
    },

    contact: Number,
    picture: String,
});

module.exports = mongoose.model("user", userSchema);
