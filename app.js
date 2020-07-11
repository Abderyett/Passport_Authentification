require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const index = require("./routes/index");
const users = require("./routes/users");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
//! Passport config
require("./config/passport")(passport);

//! Connect to EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//! BodyParser
app.use(express.urlencoded({ extended: false }));

//! Express session
app.use(
	session({
		secret: "This is our secret",
		resave: false,
		saveUninitialized: false,
	})
);
//!passport Midleware
app.use(passport.initialize());
app.use(passport.session());

//! Connect Flash

app.use(flash());
//! Global variables for flash message
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

//! Routes

app.use("/", index);
app.use("/users", users);

//! Connect to DB
try {
	mongoose.connect(process.env.DB_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log("connected successfully to DB");
} catch (err) {
	console.log(err);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`we are listening to ${PORT}`));
