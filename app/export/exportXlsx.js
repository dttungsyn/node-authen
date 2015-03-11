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
	
	TimeData.findOne({
		"username" : username,
		"monthStr" : monthstr
	}).exec(function(err, data) {
		if (err){
			return cb("err");
		}
		var timeData = data.data;
		_exportTimeData(username, monthstr, timeData, cb);
		/*_saveTimesheetFile(workbook, timeData, __dirname + "/" + monthstr + '/' + username + "_従業員出勤簿(TIMESHEET).xlsm", function(filename){
			cb(filename);
		});*/
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
	
	/*var UserData = java.import("jp.co.fpt.excel.UserData");
	var userData = new UserData();*/
	var userData = java.newInstanceSync("jp.co.fpt.excel.UserData");
	userData.setUserNameSync(username);
	userData.setMonthSync(parseInt(monthstr.split("-")[1]));
	userData.setYearSync(parseInt(monthstr.split("-")[0]));
	userData.setTimeDataSync( _convertData(timeData) );
	
	
	/*var ExportToExcelFile = java.import("jp.co.fpt.excel.ExportToExcelFile");
	var exportExcel = new ExportToExcelFile();*/
	var exportExcel = java.newInstanceSync("jp.co.fpt.excel.ExportToExcelFile");
	exportExcel.setUserDataSync(userData);
	
	//save data to excel file
	var filepath = __dirname + "/" + monthstr + "/" + username + "_従業員出勤簿(TIMESHEET)_" + monthstr.replace("-","") + ".xls";
	exportExcel.exportDataSync(__dirname + "/" + monthstr + "/tmp_template(TIMESHEET).xls", filepath);
	
	if ( typeof(cb) === 'function' ) cb( filepath );
}

function _convertData(timeData) {
	
	var java = require("java");
	var ArrayList = java.import('java.util.ArrayList');
	var monthData = new ArrayList();

	for (var day = 0; day < timeData.length; day++) {
		var time = timeData[day];
		var dayData = new ArrayList();
		for ( var col = 0; col < time.length; col ++){
			dayData.addSync( time[col] );
		}
		monthData.addSync(dayData);
	}
	
	return monthData;
}