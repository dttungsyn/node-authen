'use strict'

/**
 * time controller
 */

var TimeData = require("../models/time-data.js");
var User = require("../models/user.js");
var ExportXlsx = require("../export/exportXlsx.js");

exports.updateTimeFromExcel = updateTimeFromExcel;
exports.exportTimeData = exportTimeData;
exports.getTimeData = getTimeData;
exports.updateTimeData = updateTimeData;
exports.renderTimeview = renderTimeview;

function updateTimeFromExcel(req, res){
	
}

function exportTimeData(req, res){
	var username = req.params.username;
	var monthstr = req.body.monthstr;
	ExportXlsx.exportTimeData(username, monthstr, function(filename){
		res.set("charset", "utf-8");
		res.download(filename);
	})
}

/*function exportTimeData(req, res){
	// TODO check right to update time data
	
	var java = require("java");
	java.classpath.push(__dirname + "/src");
	java.classpath.push(__dirname + "/poi-3.11-20141221.jar");
	var UserData = java.import("jp.co.fpt.excel.UserData");
	var userData = new UserData();
	userData.setUserNameSync(req.params.username);
	userData.setMonthSync(parseInt(req.body.monthstr.split("-")[1]));
	userData.setYearSync(parseInt(req.body.monthstr.split("-")[0]));
	
	var list = convertData(req.body.data);
	
	userData.setTimeDataSync(list);
	var ExportToExcelFile = java.import("jp.co.fpt.excel.ExportToExcelFile");

	var exportExcel = new ExportToExcelFile();
	exportExcel.setUserDataSync(userData);
	exportExcel.exportDataSync(__dirname+"/tmp_template(TIMESHEET).xls");
	
}

function convertData(timeData) {
	
	var java = require("java");
	var ArrayList = java.import('java.util.ArrayList');
	var monthData = new ArrayList();
	var dayData;
	
	
	var day = 0;
	var time;

	var start = [], end = [];

	for (day = 0; day < timeData.length; day++) {
		time = timeData[day];
		
		if (time[3] == "")
			continue;
		dayData = new ArrayList();
		start = time[3].split(":");
		end = time[4].split(":");
		dayData.addSync(day);
		dayData.addSync(parseInt(start[0]));
		dayData.addSync(parseInt(start[1]));
		dayData.addSync(parseInt(end[0]));
		dayData.addSync(parseInt(end[1]));
		monthData.addSync(dayData);
	}
	
	return monthData;
}*/

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
				
				res.json(rs);
				
			});
			
			
		}
		// time data found
		else {
			rs = {
				"success" : true,
				"message" : "",
				"timedata" : timedata
			};
			
			res.json(rs);
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
