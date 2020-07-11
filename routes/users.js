const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");

const saltRounds = 10;

//! Register page
router.get("/register", (req, res) => {
	res.render("register");
});

//! Login page
router.get("/login", (req, res) => {
	res.render("login");
});

//! Register Hnadler
router.post("/register", (req, res) => {
	const { name, email, password, password2 } = req.body;
	const errors = [];
	// * Check the field
	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please fill in all field " });
	}
	//* Check the password match
	if (password !== password2) {
		errors.push({ msg: "Password doesn't match" });
	}
	//* Check the password length
	if (password.length < 6) {
		errors.push({ msg: "Password should be a least 6 charachters" });
	}
	if (errors.length > 0) {
		res.render("register", { errors, name, email, password, password2 });
	} else {
		//! validation pass

		User.findOne({ email: email }).then((user) => {
			if (user) {
				//! user exist
				errors.push({ msg: "This email already exist" });
				res.render("register", { errors, name, email, password, password2 });
			} else {
				async function createUser() {
					const newUser = await User({
						name,
						email,
						password,
					});
					bcrypt.genSalt(saltRounds, function (err, salt) {
						bcrypt.hash(newUser.password, salt, function (err, hash) {
							newUser.password = hash;
							newUser
								.save()
								.then((user) => {
									req.flash(
										"success_msg",
										"You are now successfully registered and can log in"
									);
									res.redirect("/users/login");
								})
								.catch((err) => {
									console.log(err);
								});
						});
					});
				}
				createUser();
			}
		});
	}
});
//! Login Handle
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

//! Lougout handler

router.get("/Logout", (req, res) => {
	req.logOut();
	req.flash("success_msg", "You are Logout");
	res.redirect("/users/login");
});

module.exports = router;
