/*
 * User routes
 */
var User = require("../models/user.js");

module.exports = function(app, passport) {
	
	// Get user info
	app.get('/api/userdata', isLoggedInAPI, function(req, res) {
		var user = req.user;
		return res.json(user);
	});
	
	// url with param
	app.get('/api/userdata/:username', isLoggedInAPI, function(req, res) {
		
		console.log(req.params);
		
		//TODO check right
		User.findOne({"local.username": req.params.username}).exec(function(err, user){
			if (err){
				return res.json("error!");
			}
			if (!user){
				return res.json("user not found!");
			}
			
			return res.json(user);
		});
	})
	
	// Update user info
	app.post('/api/userdata/:username', isLoggedInAPI, function(req, res) {
		var user = req.user;
		
		// check update right
		//TODO check right
		User.findOne({"local.username": req.params.username}).exec(function(err, user){
			if (err){
				return res.json("error!");
			}
			if (!user){
				return res.json("user not found!");
			}

			//Update
			user.fullname = req.body.fullname;
			user.local.email = req.body.local.email;

			user.save(function(err) {
				if (err)
					return res.json({
						"success" : false,
						"message" : "server error"
					});

				return res.json({
					"success" : true,
					"message" : "Update successful! " + user.fullname
				})
			})
		});
		
		
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