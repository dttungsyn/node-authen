/**
 * @author fpt-dev
 */
var TimeData = require("../models/time-data.js");
var User = require("../models/user.js");

if(typeof require !== 'undefined') XLSX = require('xlsx');

/*var mongoose = require('mongoose');
var configDB = require('../../config/database.js');*/

//configuration ===============================================================
//mongoose.connect(configDB.url);


/*exportTimeData('dttung1412', '2015-03', function(filename){
	console.log(filename);
});*/

exports.exportTimeData = exportTimeData;

function exportTimeData(username, monthstr, cb){
	console.log( monthstr );
	console.log( __dirname );
	var workbook = XLSX.readFile( __dirname + "/" + monthstr + '/Template_従業員出勤簿(TIMESHEET).xlsm', {cellStyles:true});
	
	TimeData.findOne({
		"username" : username,
		"monthStr" : monthstr
	}).exec(function(err, data) {
		if (err){
			return cb("err");
		}
		var timeData = data.data;
		//_exportTimeData(username, monthstr, timeData, cb);
		_saveTimesheetFile(workbook, timeData, __dirname + "/" + monthstr + '/' + username + "_従業員出勤簿(TIMESHEET).xlsm", function(filename){
			cb(filename);
		});
	});
}

function _saveTimesheetFile( workbook, timeData, filename, cb ){
	var worksheet = workbook.Sheets['Timesheet'];
	
	/*
	 * write data to worksheet
	 */
	
	for (var i = 0; i < timeData.length; i ++){
		var rowData = timeData[i];
		for (var j = 3; j < rowData.length; j ++){
			var R = i + 10;
			var C = j;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			worksheet[ cell_ref ] = {
				v: rowData[j],
				t: 's'
			}
		}
	}
	
	//save
	XLSX.writeFile(workbook, filename, {cellDates: true, bookSST: true, bookType: 'xlsx'});
	if ( typeof(cb) === 'function' ) cb( filename );
}

function _exportTimeData(username, monthstr, timeData, cb){
	// TODO check right to update time data
	var java = require("java");
	java.classpath.push(__dirname + "/src");
	java.classpath.push(__dirname + "/poi-3.11-20141221.jar");
	var UserData = java.import("jp.co.fpt.excel.UserData");
	var userData = new UserData();
	userData.setUserNameSync(username);
	userData.setMonthSync(parseInt(monthstr.split("-")[1]));
	userData.setYearSync(parseInt(monthstr.split("-")[0]));
	
	var list = _convertData(timeData);
	
	userData.setTimeDataSync(list);
	var ExportToExcelFile = java.import("jp.co.fpt.excel.ExportToExcelFile");

	var exportExcel = new ExportToExcelFile();
	exportExcel.setUserDataSync(userData);
	exportExcel.exportDataSync(__dirname + "/_tmp_template(TIMESHEET).xls");
	
	if ( typeof(cb) === 'function' ) cb( "abcd" );
}

function _convertData(timeData) {
	
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
}