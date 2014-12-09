'use strict'

/**
 * time controller
 */

var TimeData = require("../models/time-data.js");
var User = require("../models/user.js");

exports.updateTimeFromExcel = updateTimeFromExcel;
exports.getTimeData = getTimeData;
exports.updateTimeData = updateTimeData;
exports.renderTimeview = renderTimeview;

function updateTimeFromExcel(req, res){
	
}

function getTimeData(req, res){
	//TODO check right to get time data
	TimeData.findOne({
		"username" : req.params.username,
		"monthStr" : req.body.monthstr
	}).populate("fieldset").exec(function(err, timedata) {
		if (err) {
			return res.json({
				"success" : false,
				"message" : "interal error!"
			});

		}
		
		// not found
		if (!timedata) {
			console.log("not found, get fields");
			//get & return fields only
			TimeData.FieldSet.findOne(function(err, fieldset){
				var data = err? {} : {"fieldset": fieldset.fields};
				return res.json({
					"success" : false,
					"message" : "not found!",
					"timedata" : data
				})
				
			});
			
			
		}
		// time data found
		else {
			res.json({
				"success" : true,
				"message" : "",
				"timedata" : timedata
			})
		}

	});
}

function updateTimeData(req, res){
	// TODO check right to update time data
	
	var data = {
		"username" : req.params.username,
		"monthStr" : req.body.monthstr,
		"data"	   : req.body.data
	};
	
	//save data & return success
	TimeData.updateTimeData(data, function(json){
		return res.json(json);
	})
}

function renderTimeview(req, res){
	//populate user's staffs if exist
	User.findOne({"_id": req.user._id}).populate("staffs", "local.username").exec(function(err, user){
		if (err) return;
		
		//console.log(user.staffs);
		
		res.render('timeview.ejs', {
			user : user,
			isApprover: user.staffs && user.staffs.length > 0
		});
	});
}