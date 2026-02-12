const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const index = require("./routes/index")
const expressSession = require("express-session")
const flash = require("connect-flash")


const db = require("./config/mongoose-connection");

require("dotenv").config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);




app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/",index)




app.listen(3000);