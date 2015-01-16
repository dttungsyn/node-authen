'use strict'

/**
 * 
 */

var weekday = [ "日", "月", "火", "水", "木", "金", "土" ];
var defaultData = [ // usually get from database
{
	"name" : "_day",
	"defaultVal" : function(mmObj) {
		return mmObj.date();
	}
}, {
	"name" : "_wday",
	"defaultVal" : function(mmObj) {
		return mmObj.day();
	}
}, {
	"name" : "日",
	"defaultVal" : function(mmObj) {
		return mmObj.format("MM月DD日");
	},
	"colStyle" : {
		"width" : "150px"
	}
}, {
	"name" : "曜日",
	"defaultVal" : function(mmObj) {
		return weekday[mmObj.day()]
	},
	"colStyle" : {
		"width" : "100px"
	}
}, {
	"name" : "休日",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"name" : "出社",
	"defaultVal" : "9:00",
	"defaultValWend" : "",
	"fieldType" : "input",
	"inputClass" : "time-input",
	"style" : {
		"padding" : 2
	}
}, {
	"name" : "退社",
	"defaultVal" : "18:00",
	"defaultValWend" : "",
	"fieldType" : "input",
	"inputClass" : "time-input",
	"style" : {
		"padding" : 2
	}
}, {
	"name" : "休憩",
	"defaultVal" : "1:00",
	"defaultValWend" : "",
	"fieldType" : "input",
	"inputClass" : "time-input",
	"style" : {
		"padding" : 2
	}
}, {
	"name" : "有給休暇",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"name" : "実働",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"name" : "平日無給",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"colStyle" : {
		"width" : "150px"
	}
}, {
	"name" : "曜日",
	"defaultVal" : function(mmObj) {
		return weekday[mmObj.day()]
	},
	"colStyle" : {
		"width" : "100px"
	}
}, {
	"name" : "休日",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"name" : "出社",
	"defaultVal" : "9:00",
	"defaultValWend" : "",
	"fieldType" : "input",
	"inputClass" : "time-input",
	"style" : {
		"padding" : 2
	}
}, {
	"name" : "退社",
	"defaultVal" : "18:00",
	"defaultValWend" : "",
	"fieldType" : "input",
	"inputClass" : "time-input",
	"style" : {
		"padding" : 2
	}
}, {
	"name" : "休憩",
	"defaultVal" : "1:00",
	"defaultValWend" : "",
	"fieldType" : "input",
	"inputClass" : "time-input",
	"style" : {
		"padding" : 2
	}
}, {
	"name" : "有給休暇",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"name" : "実働",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"name" : "平日無給",
	"defaultVal" : "",
	"hide" : "all"
}, {
	"name" : "平日通常残業",
	"defaultVal" : "",
}, {
	"name" : "備考/Note (休みの種別など記入）",
	"defaultVal" : "",
	"hide" : "phone,tablet",// phone,tablet
	"fieldType" : "textarea",
	"style" : {
		"padding" : 0
	}
} ]

function getCurrentMonth() {

}

function getInputMonth() {
	return jQuery("#timemonth input").val();
}

/**
 * 
 * @param fieldset
 * @param mmObj
 * @returns {___anonymous1865_1896}
 */
function initMonthData(fieldset, mmObj) {
	mmObj = mmObj || moment();
	if (fieldset)
		defaultData = fieldset;

	var rs = {
		fields : [],
		data : []
	};

	var daysInMonth = mmObj.month() === moment().month() ? moment().date()
			: mmObj.daysInMonth();
	for (var d = 1; d <= daysInMonth; d++) {
		var date = mmObj.date(d);

		var data = [];
		/*
		 * defaultData.forEach(function(field, i){ data[field.name] = typeof
		 * field.defaultVal === 'function' ? field.defaultVal(date) :
		 * field.defaultVal; if ( ( date.day() == 0 || date.day() == 6 ) &&
		 * field.defaultValWend ){ data[field.name] = typeof
		 * field.defaultValWend === 'function' ? field.defaultValWend(date) :
		 * field.defaultValWend; } });
		 */
		defaultData.forEach(function(field, i) {
			var val = "";
			// day
			if (field.name === "日") {
				val = date.format("MM月DD日");
			}

			// weekday
			if (field.name === "曜日") {
				val = weekday[mmObj.day()]
			}

			// input
			if (field.name === "出社") {
				val = "9:00";
			}

			if (field.name === "退社") {
				val = "18:00";
			}

			if (field.name === "休憩") {
				val = "1:00";
			}

			if ((date.day() == 0 || date.day() == 6)
					&& field.fieldType === "input") {
				val = "";
			}

			data.push(val);
		});

		rs.data.push(data);
	}

	/*
	 * rs.fields = defaultData.map(function( field, i ){ return { "name" :
	 * field.header, "hide" : field.hide || false, "colStyle": field.colStyle ||
	 * "", "fieldType": field.fieldType || "label", "style" : field.style || "",
	 * "inputClass": field.inputClass || "" } }) .filter(function( field , i ){
	 * return field.name[0] != '_'; });
	 */

	return rs;
}

/**
 * Add each day with default data until the current day, if it already has the
 * current day, add 1 more next day (TODO)
 * 
 * @param fieldset:
 *            define default data
 * @param mmObj:
 *            month
 * @param timeData:
 *            data result to be added
 */
function addDay2MonthData(fieldset, mmObj, timeData) {
	mmObj = mmObj || moment();
	if (mmObj.month() !== moment().month())
		return;
	if (fieldset)
		defaultData = fieldset;

	var lastday = moment().date();
	if (timeData.length >= lastday) {
		// add more 1 next day TODO
		return;
	}

	for (var d = timeData.length + 1; d <= lastday; d++) {
		var date = mmObj.date(d);

		var data = [];
		/*
		 * defaultData.forEach(function(field, i){ data[field.name] = typeof
		 * field.defaultVal === 'function' ? field.defaultVal(date) :
		 * field.defaultVal; if ( ( date.day() == 0 || date.day() == 6 ) &&
		 * field.defaultValWend ){ data[field.name] = typeof
		 * field.defaultValWend === 'function' ? field.defaultValWend(date) :
		 * field.defaultValWend; } });
		 */
		defaultData.forEach(function(field, i) {
			var val = "";
			// day
			if (field.name === "日") {
				val = date.format("MM月DD日");
			}

			// weekday
			if (field.name === "曜日") {
				val = weekday[mmObj.day()]
			}

			// input
			if (field.name === "出社") {
				val = "9:00";
			}

			if (field.name === "退社") {
				val = "18:00";
			}

			if (field.name === "休憩") {
				val = "1:00";
			}

			if ((date.day() == 0 || date.day() == 6)
					&& field.fieldType === "input") {
				val = "";
			}

			data.push(val);
		});

		timeData.push(data);
	}
}

// after set month
function makeTimeTable() {
	/*
	 * fooTable
	 */
	$("#ts-table").attr("class", ""); // clear
	$("#ts-table")
			.footable(
					{
						toggleSelector : ' > tbody > tr:not(.footable-row-detail) > td:first-child',
						debug : true
					});
	// end footable

	$('.time-input').datetimepicker({
		pickDate : false,
		useCurrent : false,
		pick12HourFormat : true,
		format : "H:mm",
		minuteStepping : 5,
		direction : "bottom"
	});
}

function calculateTime(timeData, index, callback) {

	var msg;
	var overTime, restTime, exitTime, enterTime, outPutTime, workHourHoliday, actualWorkHour, workTime, restTimeLine, standardTime, fjpStandardTime, lunchTime, totalBaseTime, halfOfDay;
	var restDate, furikae, totalBaseTime, fjpRestDay, workHour, absentHour, furikaeRest, annualLeave, goOutTime;
	var workTimeTmp;
	var endIdx = (index === "all") ? timeData.length : index;
	var startIdx = (index === "all") ? 0 : index;

	var timeZero = "00:00";
	var timeFifteen = "00:15";

	// TODO cac gia tri nhu lunchtime, standardtime can fai truyen vao tu ngoai.
	// dang chuyen het tu string ve duration -> can chu y format (ko cong time
	// neu ko dung format)
	lunchTime = moment.duration('1:00');
	standardTime = fjpStandardTime = moment.duration('8:00');
	halfOfDay = moment.duration('4:00');
	totalBaseTime = moment.duration(standardTime).add(lunchTime);
	for (var idx = startIdx; idx <= endIdx; idx++) {
		var data = timeData[idx];
		restDate = data[1];
		fjpRestDay = data[2];
		enterTime = moment.duration(data[3]);
		exitTime = moment.duration(data[4]);
		restTime = moment.duration(data[5]);
		goOutTime = moment.duration(data[6]);
		furikaeRest = moment.duration(data[7]);
		annualLeave = moment.duration(data[8]);

		if (exitTime > moment.duration("23:00")) {
			var nightWorkTime = moment.duration(exitTime).subtract("23:00")
					.format("hh:mm");
			data[13] = dateFormat(nightWorkTime);
		}

		workHour = moment.duration(exitTime).subtract(enterTime);
		overTime = timeZero;
		if (restDate === '日' || restDate === '土' || data[2] === '*') {
			workHourHoliday = workHour;
			if (moment.duration(workHourHoliday) > halfOfDay.add(lunchTime)) {
				if (restTime == "" || restTime == '00') {
					outPutTime = lunchTime;
				} else {
					outPutTime = (moment.duration(restTime) > lunchTime) ? restTime
							: lunchTime;
				}
			}

			actualWorkHour = moment.duration(workHourHoliday).subtract(
					outPutTime);
			if (actualWorkHour < standardTime && actualWorkHour >= halfOfDay) {
				furikae = halfOfDay;
			} else if (actualWorkHour >= standardTime
					&& actualWorkHour < momment.duration(fjpStandardTime)) {
				furikae = actualWorkHour;
			} else if (actualWorkHour >= momment.duration(fjpStandardTime)) {
				furikae = fjpStandardTime;
			} else {
				furikae = timeZero;
			}
		} else {
			furikae = outPutTime = timeZero;
			if (enterTime == "" || enterTime == "00" || exitTime == ""
					|| exitTime == "00" || exitTime <= enterTime) {
				outPutTime = overTime = actualWorkHour = timeZero;
				workTime = moment.duration(goOutTime).add(actualWorkHour);
			} else if (moment.duration(workHour) <= moment.duration(halfOfDay)) {
				overTime = timeZero;
				actualWorkHour = moment.duration(workHour).subtract(outPutTime);
				workTime = moment.duration(actualWorkHour).add(goOutTime);
			} else if (workHour >= moment.duration(halfOfDay).add(lunchTime)
					&& workHour < totalBaseTime) {
				outPutTime = lunchTime;
				actualWorkHour = moment.duration(workHour).subtract(outPutTime);
				workTime = moment.duration(actualWorkHour).add(goOutTime);
			} else {
				// if ("HAKEN") {
				if (false) {
					outPutTime = lunchTime;
				} else {
					var otCheck = moment.duration(workHour).subtract(
							fjpStandardTime).subtract(lunchTime);
					// console.log("overTime-check : " +
					// otCheck.format("hh:mm"));
					// console.log("condition 1 : " + (otCheck >
					// moment.duration(timeZero) && otCheck <
					// moment.duration('02:15')) || (otCheck ==
					// moment.duration('02:15')));
					if (otCheck > moment.duration(timeZero)
							&& otCheck <= moment.duration('02:15')) {
						outPutTime = moment.duration(lunchTime).add(
								fjpStandardTime).subtract(standardTime).add(
								timeFifteen);
						console.log("outPutTime1 : "
								+ outPutTime.format("hh:mm"));
					} else if (otCheck > moment.duration('02:15')) {
						outPutTime = moment.duration(lunchTime).add(
								fjpStandardTime).subtract(standardTime).add(
								timeFifteen).add(timeFifteen);
						console.log("outPutTime2 : "
								+ outPutTime.format("hh:mm"));
					} else {
						outPutTime = moment.duration(lunchTime).add(
								fjpStandardTime).subtract(standardTime);
						console.log("outPutTime3 : "
								+ outPutTime.format("hh:mm"));
					}
				}
				overTime = moment.duration(workHour).subtract(fjpStandardTime)
						.subtract(outPutTime).add(furikaeRest).add(annualLeave);
				// console.log(overTime > 13.5);
				if (overTime > moment.duration("1:30")) {
					msg = "overtime was exceed 13h30m";
				}
				actualWorkHour = moment.duration(workHour).subtract(outPutTime);
				workTime = moment.duration(actualWorkHour).add(goOutTime);
			}
			// workTime = moment.duration(actualWorkHour).add(goOutTime);
			absentHour = moment.duration(standardTime).subtract(workTime)
					.subtract(furikaeRest).subtract(annualLeave);
		}

		data[5] = dateFormat(moment.duration(outPutTime).format("hh:mm"));
		data[12] = dateFormat(moment.duration(overTime).format("hh:mm"));
		data[15] = dateFormat(moment.duration(furikae).format("hh:mm"));
		data[9] = dateFormat(moment.duration(actualWorkHour).format("hh:mm"));
		data[10] = dateFormat(moment.duration(workTime).format("hh:mm"));
		if (absentHour != null && absentHour !== "") {
			if (absentHour < 0) {
				data[11] = "00:00";
				data[12] = dateFormat(moment.duration(absentHour * -1).format(
						"hh:mm"));
			} else {
				data[11] = dateFormat(moment.duration(absentHour).format(
						"hh:mm"));
			}
		}

		timeData[idx] = data;
		// console.log( timeData[idx] );
		// get col : 0,0,1,3+'～'+4,12,13,14,15,7,16,17

	}
	callback(msg);
}

function dateFormat(iDate) {
	var sDate = iDate.toString();
	if (iDate < 0)
		return "00:00";
	return sDate.indexOf(":") == -1 ? "00:" + sDate : sDate;
}

function calFooterTime(tData) {

	// console.log('otData');
	// console.log(otData);

	if (tData == "")
		return ([ "Total", "", "", "", "", "", "", "", "", "", "", "", "", "",
				"" ]);

	var day = 0;
	var dayData;

	var footData = [];
	var data5 = tData[0][5];
	var data6 = tData[0][6];
	var data7 = tData[0][7];
	var data8 = tData[0][8];
	var data9 = tData[0][9];
	var data10 = tData[0][10];
	var data11 = tData[0][11];
	var data12 = tData[0][12];
	var data13 = tData[0][13];
	var data14 = tData[0][14];
	var data15 = tData[0][15];
	// var total = moment.duration(otData[0][12]);

	for (day = 1; day < tData.length; day++) {
		var data = tData[day];

		data5 = moment.duration(data5).add(data[5]);
		data6 = moment.duration(data6).add(data[6]);
		data7 = moment.duration(data7).add(data[7]);
		data8 = moment.duration(data8).add(data[8]);
		data9 = moment.duration(data9).add(data[9]);
		data10 = moment.duration(data10).add(data[10]);
		data11 = moment.duration(data11).add(data[11]);
		data12 = moment.duration(data12).add(data[12]);
		data13 = moment.duration(data13).add(data[13]);
		data14 = moment.duration(data14).add(data[14]);
		data15 = moment.duration(data15).add(data[15]);
	}

	var format = "HH:mm"
	footData.push("Total", "", "", "", "", dateFormat(data5),
			dateFormat(data6), dateFormat(data7), dateFormat(data8),
			dateFormat(data9), dateFormat(data10), dateFormat(data11),
			dateFormat(data12), dateFormat(data13), dateFormat(data14),
			dateFormat(data15));
	console.log('final result : ' + footData);

	return footData;
}
