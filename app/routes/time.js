/*
 * Time routes
 */

var TimeData = require("../models/time-data.js");
var User = require("../models/user.js");
module.exports = function(app, passport) {
	
	// Update time data, posted from excel
	app.post('/api/timedata-with-authen', function(req, res, next) {
		req.body = JSON.parse(req.body.data);
		console.log(req.body.username);
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
			
			var data = {
				"username" : user.local.username,
				"monthStr" : req.body.monthstr,
				"data"	   : req.body.data
			};

			//save data & return success
			TimeData.updateTimeData(data, function(rs) {
				return res.json(rs);
			})

		})(req, res, next);
	});
	
	
	// Get time data TODO move to model
	app.post('/api/timedata', isLoggedInAPI, function(req, res) {

		TimeData.findOne({
			"username" : req.user.local.username,
			"monthStr" : req.body.monthstr
		}).populate("fieldset").exec(function(err, timedata) {
			if (err) {
				return res.json({
					"success" : false,
					"message" : "interal error!"
				});

			}
			
			//var found = timeData ? true: false;

			// not found
			if (!timedata) {
				console.log("not found, get fields");
				//get fields
				TimeData.FieldSet.findOne(function(err, fieldset){
					var data = err? {} : {"fieldset": fieldset.fields};
					return res.json({
						"success" : false,
						"message" : "not found!",
						"timedata" : data
					})
					
				});
				
				
			}
			else {
				console.log(timedata.fieldset.fields);
				//timedata.fields = timedata.fields.fields;
				res.json({
					"success" : true,
					"message" : "",
					"timedata" : timedata
				})
			}

			// time data found

		});
	})
	
	
	// Add / Update time data, from view
	app.post('/api/savetimedata', isLoggedInAPI, function(req, res) {

		var data = {
			"username" : req.user.local.username,
			"monthStr" : req.body.monthstr,
			"data"	   : req.body.data
		};
		
		TimeData.updateTimeData(data, function(json){
			return res.json(json);
		})
		
	})

	// =============================================================================
	// LOAD PAGE =============================================================
	// =============================================================================
	// used to ...
	app.get('/timeview', isLoggedIn, function(req, res) {

		
		//populate user's staffs if exist
		User.findOne({"_id": req.user._id}).populate("staffs", "local.username").exec(function(err, user){
			if (err) return;
			
			//console.log(user.staffs);
			
			res.render('timeview.ejs', {
				user : user,
				isApprover: user.staffs && user.staffs.length > 0
			});
		});
		
		
	});

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
