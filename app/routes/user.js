/*
 * User routes
 */

module.exports = function(app, passport) {
	// Get user info
	app.get('/api/userdata', isLoggedInAPI, function(req, res) {
		var user = req.user;
		res.json(user);
	})
	
	// Update user info
	app.post('/api/userdata', isLoggedInAPI, function(req, res) {
		var user = req.user;
		user.fullname = req.body.fullname;
		user.local.email = req.body.local.email;

		console.log(user);

		user.save(function(err) {
			if (err)
				return res.json({
					"success" : false,
					"message" : "server error"
				});

			return res.json({
				"success" : true,
				"message" : "update successful!"
			})
		})
	})
}

//route middleware to ensure user is logged in
function isLoggedInAPI(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.json({
		"success" : false,
		"message" : "not logged in"
	});
}