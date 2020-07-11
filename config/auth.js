module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash("error_msg", "You are not authorized to access to this content");
		res.redirect("/users/login");
	},
};
