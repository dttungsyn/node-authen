/*
 * Routes definition
 */

module.exports = function(app, passport) {

	// =============================================================================
	// REST API =============================================================
	// =============================================================================
	// used to ...

	/// API with authentication each time-----------------------

	
	/// API for logged in user--------------------------------
	

	// Param
	app.param('username', function (req, res, next, username) {
	  req.params.username = username;
	  console.log('CALLED ONLY ONCE');
	  next();
	});
	
	require("./routes/authen.js")(app, passport);
	require("./routes/time.js")(app, passport);
	require("./routes/user.js")(app, passport);
	require("./routes/status.js")(app, passport);
	require("./routes/fieldset.js")(app, passport);
	require("./routes/admin.js")(app, passport);

};

