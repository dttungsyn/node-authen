'use strict'

/**
 * time controller
 */

var TimeData = require("../models/time-data.js");
var User = require("../models/user.js");
var ExportXlsx = require("../export/exportXlsx.js");

exports.updateTimeFromExcel = updateTimeFromExcel;
exports.exportTimeData = exportTimeData;
exports.exportMultipleTimeData = exportMultipleTimeData;
exports.getTimeData = getTimeData;
exports.updateTimeData = updateTimeData;
exports.renderTimeview = renderTimeview;

function updateTimeFromExcel(req, res){
	
}

/**
 * 
 * @param req
 * @param res
 */
function exportTimeData(req, res){
	var username = req.params.username;
	var monthstr = req.body.monthstr;
	ExportXlsx.exportTimeData(username, monthstr, function(filename){
		
		//res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
		//res.setHeader('Content-disposition', 'attachment; filename=ああ;charset=utf-8');
		res.set("charset", "utf-8");
		res.download(filename);
		console.log( res.get('Content-disposition') );
		console.log( res.get('Content-type') );
	})
}

/**
 * 
 * @param req
 * @param res
 */
function exportMultipleTimeData(req, res){
	var users = req.body.users;
	var monthstr = req.body.monthstr;
	ExportXlsx.exportMultipleTimeData(users, monthstr, function(zipFile){
		
		//res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
		//res.setHeader('Content-disposition', 'attachment; filename=ああ;charset=utf-8');
		res.set("charset", "utf-8");
		res.download(zipFile);
		console.log( res.get('Content-disposition') );
		console.log( res.get('Content-type') );
	})
}

/**
 * 
 * @param req
 * @param res
 */
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
		
		
		var rs = {};
		
		// not found
		if (!timedata) {
			console.log("not found, get fields");
			//get & return fields only
			TimeData.FieldSet.findOne(function(err, fieldset){
				var data = err? {} : {"fieldset": fieldset.fields};
				rs = {
					"success" : false,
					"message" : "not found!",
					"timedata" : data
				};
				
				_addHolidayInfo();
				
			});
			
			
		}
		// time data found
		else {
			rs = {
				"success" : true,
				"message" : "",
				"timedata" : timedata
			};
			
			_addHolidayInfo();
		}
		
		function _addHolidayInfo(){
			var year = parseInt( req.body.monthstr.split("-")[0] );
			var month = parseInt( req.body.monthstr.split("-")[1] );
			
			_getHolidayMonth(year,month,function( holidays ){
				rs.holidays = holidays;
				res.json( rs );
			})
		}

	});
}

/**
 * 
 * @param year
 * @param month
 * @param cb
 */
function _getHolidayMonth(year, month, cb){
	var Calendar = require("../models/calendar.js");
	Calendar.findOne({'year': year}).exec(function(err, calendar){
		if (err){
			return cb(null);
		}
		cb( calendar.months[month] );
	})
}

/**
 * 
 * @param req
 * @param res
 */
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

/**
 * 
 * @param req
 * @param res
 */
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
