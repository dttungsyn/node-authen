/**
 * @author fpt-dev
 */
var TimeData = require("../models/time-data.js");
var User = require("../models/user.js");

if(typeof require !== 'undefined') XLSX = require('xlsx');

var mongoose = require('mongoose');
var configDB = require('../../config/database.js');

//configuration ===============================================================
mongoose.connect(configDB.url);


exportTimeData('dttung1412', '2015-03', function(filename){
	console.log(filename);
});

function exportTimeData(username, monthstr, cb){
	var workbook = XLSX.readFile(monthstr + '/Template_従業員出勤簿(TIMESHEET).xlsm');
	
	TimeData.findOne({
		"username" : username,
		"monthStr" : monthstr
	}).exec(function(err, data) {
		if (err){
			return cb("err");
		}
		var timeData = data.data;
		_saveTimesheetFile(workbook, timeData, monthstr + '/' + username + "_従業員出勤簿(TIMESHEET).xlsm", function(filename){
			cb(filename);
		});
	});
}

function _saveTimesheetFile( workbook, timeData, filename, cb ){
	var worksheet = workbook.Sheets['Timesheet'];
	
	/*
	 * write data to worksheet
	 */
	
	/*for (var i = 0; i < timeData.length; i ++){
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
	}*/
	
	//save
	XLSX.writeFile(workbook, filename, {cellDates: true, bookSST: true, bookType: 'xlsm'});
	if ( typeof(cb) === 'function' ) cb( filename );
}