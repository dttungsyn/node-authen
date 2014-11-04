var TimeData = require("./models/time-data.js");

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { 
				message: req.flash('loginMessage'),
				action : 'login'
			});
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/timeview', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('login.ejs', { 
				message: req.flash('loginMessage'),
				action : 'signup'
			});
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', isLoggedIn, function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', isLoggedIn, function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', isLoggedIn, function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});
	

// =============================================================================
// REST API =============================================================
// =============================================================================
// used to ...

	
	/// API with authentication each time-----------------------
	
	// Update time data
	app.post('/api/timedata-with-authen', function(req, res, next) {
	  passport.authenticate('local-login', {
		  session: false
		  , failureFlash : "Invalid username or password."
	  }, function(err, user, info) {
	    if (err) { 
	    	return res.json( req.flash('loginMessage') );
	    }
	    
	    if (!user) { 
	    	return res.json( req.flash('loginMessage') );
	    }
	   
	    
	    //save data & return success
	    TimeData.updateTimeData(req.body, function(rs){
	    	res.json( rs );
	    })
	    
	  })(req, res, next);
	});
	
	
	/// API for logged in user--------------------------------
	
	// Get user info
	app.get('/api/userdata', isLoggedInAPI, function(req, res) {
		var user = req.user;
		res.json( user );
	})
	
	// Get time data
	app.post('/api/timedata', isLoggedInAPI, function(req, res) {
		
		console.log(req.body.monthstr);
		
		TimeData.findOne({"username": req.user.local.username, "monthStr": req.body.monthstr}, function(err, timedata){
			if (err){
				return res.json({
					"success": false,
					"message": "interal error!"
				});
				
			}
			
			// not found
			if (!timedata){
				return res.json({
					"success": false,
					"message": "not found!"
				})
			}
			
			res.json({
				"success"   : true,
				"message"  : "",
				"timedata" : timedata
			})
			
			// time data found
			
		});
	})
	
	// Update user info
	app.post('/api/userdata', isLoggedInAPI, function(req, res) {
		var user = req.user;
		user.fullname = req.body.fullname;
		user.local.email = req.body.local.email;
		
		console.log( user );
		
		user.save(function(err){
			if (err) 
				return res.json({
							"success": false,
							"message": "server error"
						});
			
			return res.json({
				"success": true,
				"message": "update successful!"
			})
		})
	})
	
	// Add / Update time data
	app.post('/api/savetimedata', isLoggedInAPI, function(req, res) {
		
		TimeData.findOne({"username": req.user.local.username, "monthStr": req.body.monthstr}, function(err, timedata){
			if (err){
				return res.json({
					"success": false,
					"message": "interal error!"
				});
				
			}
			
			// not found
			if (!timedata){
				//add new
				var newTimeData = new TimeData();
				newTimeData.username = req.user.local.username;
				newTimeData.monthStr = req.body.monthstr;
				newTimeData.fields = req.body.fields;
				newTimeData.data   = req.body.data;
				
				newTimeData.save(function(err){
					if (err){
						return res.json({
							"success"   : false,
							"message"  : "Db save error"
						})
					}
					
					return res.json({
						"success"   : true,
						"message"  : "Add new Time Data Success!"
					})
				})
			}
			
			else {
				timedata.fields = req.body.fields;
				timedata.data   = req.body.data;
				
				timedata.save(function(err){
					if (err){
						return res.json({
							"success"   : false,
							"message"  : "Db save error"
						})
					}
					
					return res.json({
						"success"   : true,
						"message"  : "Update Time Data Success!"
					})
				})
			}
			
			// time data found
			
		});
	})
	

// =============================================================================
// LOAD PAGE =============================================================
// =============================================================================
// used to ...
	app.get('/timeview', isLoggedIn, function(req, res) {

		res.render('timeview.ejs', {
			user : req.user
		});
	});

};

// route middleware to ensure user is logged in
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
		"success": false,
		"message": "not logged in"
	});
}
