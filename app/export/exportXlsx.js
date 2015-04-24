/**
 * @author fpt-dev
 */
var TimeData = require("../models/time-data.js");
var User = require("../models/user.js");

if(typeof require !== 'undefined') XLSX = require('xlsx');

exports.exportTimeData = exportTimeData;
exports.exportMultipleTimeData = exportMultipleTimeData;

/**
 * 
 */
function exportMultipleTimeData(users, monthstr, cb){
	var done = 0;
	var filepaths = [];
	
	for (var i in users){
		var user = users[i];
		exportTimeData(user, monthstr, function( filepath ){
			done ++;
			filepaths.push( filepath );
			zip();
		})
	}
	
	function zip(){
		if (done < users.length) return;
		done = 0;
		
		var JSZip = require('jszip');
		var zip = new JSZip();
		var fs = require("fs");

		function addFile (ind) {
			if (ind == filepaths.length){
				saveZip();
				return;
			}

			fs.readFile( filepaths[ind], function(err, data) {
			  if (err) throw err;

			  zip.file(users[ind] + "_(TIMESHEET)_" + monthstr.replace("-","") + ".xls", data);

			  addFile( ind + 1 );
			});
		}

		addFile(0);
		
		function saveZip(){
			var zipFile = __dirname + "/files/" + monthstr + "/" + "timesheets_" + monthstr.replace("-","") + ".zip";
			var content = zip.generate({type:"nodebuffer"});
			
			fs.writeFile(zipFile, content, function(err){
				/*...*/
				if (err) {
					return cb(null);
				}
				
				cb( zipFile );
				
			});
		}
	}
}

/**
 * 
 * @param username
 * @param monthstr
 * @param cb
 */
function exportTimeData(username, monthstr, cb){
	
	TimeData.findOne({
		"username" : username,
		"monthStr" : monthstr
	}).exec(function(err, data) {
		if (err){
			return cb(null);
		}
		var timeData = data ? data.data : null;
		_exportTimeData(username, monthstr, timeData, cb);
		/*_saveTimesheetFile(workbook, timeData, __dirname + "/" + monthstr + '/' + username + "_従業員出勤簿(TIMESHEET).xlsm", function(filename){
			cb(filename);
		});*/
	});
}

/**
 * 
 * @param workbook
 * @param timeData
 * @param filename
 * @param cb
 */
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

/**
 * Call java class
 * @param username
 * @param monthstr
 * @param timeData
 * @param cb
 */
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
	var filepath = __dirname + "/files/" + monthstr + "/" + username + "_(TIMESHEET)_" + monthstr.replace("-","") + ".xls";
	exportExcel.exportDataSync(__dirname + "/tmp_template(TIMESHEET).xls", filepath);
	
	if ( typeof(cb) === 'function' ) cb( filepath );
}

/**
 * 
 * @param timeData
 * @returns {ArrayList}
 */
function _convertData(timeData) {
	
	var java = require("java");
	var ArrayList = java.import('java.util.ArrayList');
	var monthData = new ArrayList();

	if (timeData){
		for (var day = 0; day < timeData.length; day++) {
			var time = timeData[day];
			var dayData = new ArrayList();
			for ( var col = 0; col < time.length; col ++){
				dayData.addSync( time[col] );
			}
			monthData.addSync(dayData);
		}
	}
	
	return monthData;
}