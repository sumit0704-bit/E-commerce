require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const index = require("./routes/index")
const session = require("express-session");
const flash = require("connect-flash")


require("./config/mongoose-connection");




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/",index)




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});