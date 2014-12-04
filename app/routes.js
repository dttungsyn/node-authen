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
	

	require("./routes/authen.js")(app, passport);
	require("./routes/time.js")(app, passport);
	require("./routes/user.js")(app, passport);

};

