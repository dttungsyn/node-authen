/*
 * User routes
 */
var controller = require("../controllers/user.js");

module.exports = function(app, passport) {
	
	// Get user info - getUserData
	app.get('/api/userdata', isLoggedInAPI, controller.getUserData);
	
	// url with param - getUserDataByUsername
	app.get('/api/userdata/:username', isLoggedInAPI, controller.getUserDataByUsername)
	
	// Update user info - updateUserDataByUsername
	app.post('/api/userdata/:username', isLoggedInAPI, controller.updateUserDataByUsername)
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