'use strict'

/**
 * Time routes
 */
var controller = require("../controllers/time.js");

module.exports = function(app, passport) {
	
	// Update time data, posted from excel - updateTimeFromExcel
	app.post('/api/timedata-with-authen', function(req, res, next) {
		req.body = JSON.parse(req.body.data);
		//console.log(req.body.username);
		passport.authenticate('local-login', {
			session : false,
			failureFlash : "Invalid username or password."
		}, function(err, user, info) {
			if (err) {
				return res.json(req.flash('loginMessage'));
			}
			if (!user) {
				return res.json(req.flash('loginMessage'));
			}
			
			req.params.username = user.local.username;
			
			//invoke controller
			controller.updateTimeData(req, res);

		})(req, res, next);
	});
	
	// export data
	app.post('/api/exporttimedata/:username', isLoggedInAPI, controller.exportTimeData);
	
	
	// Get time data TODO move to model - getTimeData
	app.post('/api/timedata/:username', isLoggedInAPI, controller.getTimeData);
	
	
	// Add / Update time data, from view - updateTimeData
	app.post('/api/savetimedata/:username', isLoggedInAPI, controller.updateTimeData);

	// =============================================================================
	// LOAD PAGE =============================================================
	// =============================================================================
	// used to ... - renderTimeview
	app.get('/timeview', isLoggedIn, controller.renderTimeview);

}

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
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
