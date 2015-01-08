'use strict'

/**
 * 
 */

var weekday = ["日", "月", "火","水","木","金","土"];
var defaultData = [	// usually get from database
	{
		"name" : "_day",
		"defaultVal": function(mmObj){
			return mmObj.date();
		}
	},
	{
		"name" : "_wday",
		"defaultVal": function(mmObj){
			return mmObj.day();
		}
	},
	{
		"name" : "日",
		"defaultVal": function(mmObj){
			return mmObj.format("MM月DD日");
		},
		"colStyle": {
			"width" : "150px"
		}
	},
	{
		"name" : "曜日",
		"defaultVal": function(mmObj){
			return weekday[ mmObj.day() ]
		},
		"colStyle": {
			"width" : "100px"
		}
	},
	{
		"name" : "休日",
		"defaultVal": "",
		"hide" : "all"
	},
	{
		"name" : "出社",
		"defaultVal": "9:00",
		"defaultValWend": "",
		"fieldType"  : "input",
		"inputClass" : "time-input",
		"style": {
			"padding": 2
		}
	},
	{
		"name" : "退社",
		"defaultVal": "18:00",
		"defaultValWend": "",
		"fieldType" : "input",
		"inputClass" : "time-input",
		"style": {
			"padding": 2
		}
	},
	{
		"name" : "休憩",
		"defaultVal": "1:00",
		"defaultValWend": "",
		"fieldType" : "input",
		"inputClass" : "time-input",
		"style": {
			"padding": 2
		}
	},
	{
		"name" : "有給休暇",
		"defaultVal": "",
		"hide" : "all"
	},
	{
		"name" : "実働",
		"defaultVal": "",
		"hide" : "all"
	},
	{
		"name" : "平日無給",
		"defaultVal": "",
		"hide" : "all"
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
function initMonthData(fieldset, mmObj ){
	mmObj = mmObj || moment();
	if (fieldset)
		defaultData = fieldset;

	var rs = {
		fields : [],
		data : []
	};
	
	var daysInMonth = mmObj.month() === moment().month() ? moment().date() : mmObj.daysInMonth();
	for (var d = 1; d <= daysInMonth; d++){
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
 * Add each day with default data until the current day, if it already has the current day, add 1 more next day (TODO) 
 * @param fieldset: define default data
 * @param mmObj: month
 * @param timeData: data result to be added
 */
function addDay2MonthData(fieldset, mmObj, timeData){
	mmObj = mmObj || moment();
	if ( mmObj.month() !== moment().month() ) return;
	if (fieldset) defaultData = fieldset;
	
	var lastday = moment().date();
	if (timeData.length >= lastday){
		//add more 1 next day TODO
		return;
	}
	
	for (var d = timeData.length + 1; d <= lastday; d++){
		var date = mmObj.date(d); 
		
		var data = [];
		/*defaultData.forEach(function(field, i){
			data[field.name] = typeof field.defaultVal === 'function' ? field.defaultVal(date) : field.defaultVal;
			if ( ( date.day() == 0 || date.day() == 6 ) && field.defaultValWend ){
				data[field.name] = typeof field.defaultValWend === 'function' ? field.defaultValWend(date) : field.defaultValWend;
			}
		});*/
		defaultData.forEach(function(field, i){
			var val = "";
			//day
			if (field.name === "日"){
				val = date.format("MM月DD日");
			}
			
			//weekday
			if (field.name === "曜日"){
				val = weekday[ mmObj.day() ]
			}
			
			
			
			//input
			if (field.name === "出社"){
				val = "9:00";
			}
			
			if (field.name === "退社"){
				val = "18:00";
			}
			
			if (field.name === "休憩"){
				val = "1:00";
			}
			
			if ( ( date.day() == 0 || date.day() == 6 ) && field.fieldType === "input"){
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

function calculateTime(timeData, index) {

	var overTimer, restTime, exitTime, enterTime, outPutTime, workHourHoliday, actualWorkHour, workTime, restTimeLine, standardTime, fjpStandardTime, lunchTime, totalBaseTime, halfOfDay;
	var restDate, furikae,totalBaseTime;
	var endIdx = (index === "all") ? timeData.length : index;
	var startIdx = (index === "all") ? 0 : index;

	var timeZero = moment.duration('00:00');
	var timeFifteen = moment.duration('15:00');
	
	//TODO cac gia tri nhu lunchtime, standardtime can fai truyen vao tu ngoai.
	// dang chuyen het tu string ve duration -> can chu y format (ko cong time neu ko dung format)  
	lunchTime = moment.duration('1:00');
	standardTime = moment.duration('8:00');
	halfOfDay = moment.duration('4:00');
	totalBaseTime = standardTime.add(lunchTime);
	for (idx = startIdx; idx <= endIdx; idx++) {
		restDate = timeData[1];
		fjpRestDay = timeData[2];
		enterTime = timeData[3];
		exitTime = timeData[4];
		restTime = moment.duration(timeData[5]);
		workTime = moment.duration(exitTime).subtract(enterTime);
		if (restDate === '日' || restDate === '土' || timeData[2] === '*') {
			workHourHoliday = workTime;
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
				furikae = "";
			}
		} else {
			furikae = "";
			restTimeVal = "";
			outPutTime = timeZero;
			if (enterTime == "" || enterTime == "00" || exitTime == "" || exitTime == "00") continue;
			if (workTime <= halfOfDay) {
				overTime = timeZero;
			} else if (workTime > halfOfDay.add(lunchTime) && workTime < totalBaseTime) {
				outPutTime = lunchTime;
			} else {
				overTime = workTime.subtract(fjpStandardTime).subtract(lunchTime);
				if ("HAKEN") {
					outPutTime = lunchTime;
				} else {
					if ((overTime > timeZero && overTime < moment.duration('02:15:00')) || (overTime == moment.duration('02:15:00'))) {
						outPutTime = lunchTime.add(fjpStandardTime).subtract(standardTime).add(timeFifteen);
					} else if (overTime > moment.duration('02:15:00')) {
						outPutTime = lunchTime.add(fjpStandardTime).subtract(standardTime).add(timeFifteen).add(timeFifteen);
					} else {
						outPutTime = lunchTime.add(fjpStandardTime).subtract(standardTime);
					}
				}
			}
		}
	}

}