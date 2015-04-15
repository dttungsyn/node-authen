(function($){

'use strict'
	
var FptTIME = window.FptTIME || {};


FptTIME.version = '1.0';
FptTIME.dev = true //set false when in production

window.FptTIME = FptTIME;

//======= init layout ==========
$("document").ready(function(){

	//set month picker
	$('#timemonth').datetimepicker({
		pickTime : false,
		minViewMode: "months",
		useCurrent: true
		
	})
	.on("dp.change",function (e) {
	    $("#timemonth input").change();
	});
	
	//save button affix
	setTimeout(function(){
		$('.ts-submit').affix({
		    offset: {
		      top: $('.ts-submit').offset().top + 20
		    }
		})
		
		//name bar
		$('.name-bar').affix({
		    offset: {
		      top: function(){
		    	  if ( $('.name-bar').hasClass('affix') )
		    		  return name_bar_top;
		    	  
		    	  return $('.name-bar').offset().top;
		    	  
		    	  
		      }
		    }
		})
		var name_bar_top;
		$('.name-bar').on('affix.bs.affix', function(){
			name_bar_top = $('.name-bar').offset().top;
			//console.log( name_bar_top );
		});
		
		//staff list
		/*$('.list-group').affix({
		    offset: {
		      top: function(){
		    	  if ( $('.list-group').hasClass('affix') )
		    		  return list_group_top;
		    	  
		    	  return $('.list-group').offset().top - 60;
		    	  
		    	  
		      }
		    }
		})*/
		var list_group_top;
		$('.list-group').on('affix.bs.affix', function(){
			list_group_top = $('.list-group').offset().top - 60;
			//console.log( list_group_top );
		});
		
		
	}, 1000);
	
	
	$('.selectpicker').selectpicker();
	
	$('select.selectpicker').on('change', function(){
        var selected = $('.selectpicker option:selected').val();
        $('.selectstaff').val(selected);	//element that is bind with ng-model
        $('.selectstaff').change();
        //console.log(selected);
     });
	
})

/*
 * Expose
 */
FptTIME.assignChangeTabEventHandler = assignChangeTabEventHandler;

FptTIME.initMonthData = initMonthData;
FptTIME.addDay2MonthData = addDay2MonthData
FptTIME.makeTimeTable = makeTimeTable
FptTIME.calculateTime = calculateTime
FptTIME.calFooterTime = calFooterTime
FptTIME.dateFormat = dateFormat
FptTIME.addHoliday2TimeData = addHoliday2TimeData

/**
 * 
 */

function assignChangeTabEventHandler( scope ){
	//tab change event
	$('.bs-timesheet a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  scope.multiview = false;
	  if ( $(e.target).attr("href") == "#home" ){
		  // update time table
		  console.log("update time table");
		  $("#ts-table").resize();
	  } 
	  else if ( $(e.target).attr("href") == "#chart" ){
		  // update chart
		  console.log("update chart");
		  fpttime.chart.update();
	  }
	  else if ( $(e.target).attr("href") == "#multiview" ){
		  // update chart
		  console.log("open multiview");
		  scope.multiview = true;
	  }
	  
	  scope.$apply();
	  //console.log(e.relatedTarget) // previous tab
	})
}

var timeFmt = "HH:mm"
var weekday = [ "日", "月", "火", "水", "木", "金", "土" ];
var defaultData = []

function getCurrentMonth() {}

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
				val = "09:00";
			}

			if (field.name === "退社") {
				val = "18:00";
			}

			if (field.name === "休憩") {
				val = "01:00";
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

function addHoliday2TimeData(holidays, timeData){
	for (var i in holidays){
		var holiday = holidays[i];
		if (holiday > timeData.length) return;
		timeData[ holiday - 1 ][2] = "*";
	}
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
				val = "09:00";
			}

			if (field.name === "退社") {
				val = "18:00";
			}

			if (field.name === "休憩") {
				val = "01:00";
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
		format : timeFmt,
		minuteStepping : 5,
		direction : "bottom"
	});
}

function calculateTime(timeData, index, callback) {

	var msg;
	var overTime, exitTime, enterTime, actualRest, workHourHoliday, actualWorkHoliday, actualWorkHour, workTime;
	var restDate, furikae, fjpRestDay, workHour, absentHour, furikaeRest, annualLeave, goOutTime, nightWorkTime, standardTime, fjpStandardTime;

	var endIdx = (index === "all") ? timeData.length - 1 : index;
	var startIdx = (index === "all") ? 0 : index;

	var time0 = moment.duration("00:00");
	var time15 = "00:15";

	var lunchTime = moment.duration('1:00');
	standardTime = fjpStandardTime = moment.duration('8:00');
	var halfOfDay = moment.duration('4:00');
	var totalBaseTime = moment.duration(standardTime).add(lunchTime);

	for (var idx = startIdx; idx <= endIdx; idx++) {
		var data = timeData[idx];
		restDate = data[1];
		fjpRestDay = data[2];
		enterTime = moment.duration(data[3]);
		exitTime = moment.duration(data[4]);
		goOutTime = moment.duration(data[6]);
		furikaeRest = moment.duration(data[7]);
		annualLeave = moment.duration(data[8]);

		workTime = moment.duration(exitTime).subtract(enterTime);
		actualRest = overTime = time0;
		if (restDate === '日' || restDate === '土' || fjpRestDay === '*') {
			overTime = absentHour = nightWorkTime = time0;
			if (enterTime == "" || enterTime == "00" || exitTime == ""
					|| exitTime == "00" || exitTime <= enterTime) {
				workHour = workTime = time0;
			} else {
				workHour = moment.duration(workTime).subtract(actualRest);
			}

			actualWorkHour = moment.duration(workHour).add(goOutTime);
			if (actualWorkHour >= moment.duration(halfOfDay).add(lunchTime)) {
				var restTime = moment.duration(data[5]);
				if (restTime == "" || restTime == '00') {
					actualRest = lunchTime;
				} else {
					actualRest = (moment.duration(restTime) >= lunchTime) ? restTime
							: lunchTime;
				}
			}
			
			if (actualWorkHour < standardTime && actualWorkHour >= halfOfDay) {
				furikae = halfOfDay;
			} else if (actualWorkHour >= standardTime
					&& actualWorkHour < moment.duration(fjpStandardTime)) {
				furikae = actualWorkHour;
			} else if (actualWorkHour >= moment.duration(fjpStandardTime)) {
				furikae = fjpStandardTime;
			} else {
				furikae = time0;
			}

			workHourHoliday = (workHour > furikae) ? moment.duration(
					workHour).subtract(furikae) : time0;
			
		} else {
			furikae = workHourHoliday = time0;
			if (enterTime == "" || enterTime == "00" || exitTime == ""
					|| exitTime == "00" || exitTime <= enterTime) {
				workHour = actualRest = overTime = nightWorkTime = time0;
			} else {
				if (moment.duration(workTime) <= moment.duration(halfOfDay)) {
					actualRest = overTime = time0;
				} else if (workTime >= moment.duration(halfOfDay)
						.add(lunchTime)
						&& workTime < totalBaseTime) {
					actualRest = lunchTime;

				} else {
					// if ("HAKEN") {
					if (false) {
						actualRest = lunchTime;
					} else {
						var otCheck = moment.duration(workTime).subtract(
								fjpStandardTime).subtract(lunchTime);
						if (otCheck > moment.duration(time0)
								&& otCheck <= moment.duration('02:15')) {
							actualRest = moment.duration(lunchTime).add(
									fjpStandardTime).subtract(standardTime)
									.add(time15);
						} else if (otCheck > moment.duration('02:15')) {
							actualRest = moment.duration(lunchTime).add(
									fjpStandardTime).subtract(standardTime)
									.add('00:30');
						} else {
							actualRest = moment.duration(lunchTime).add(
									fjpStandardTime).subtract(standardTime);
						}
					}
				}
				workHour = moment.duration(workTime).subtract(actualRest);
			}
			actualWorkHour = moment.duration(workHour).add(goOutTime);

			if (actualWorkHour > fjpStandardTime) {
				overTime = moment.duration(actualWorkHour).subtract(
						fjpStandardTime).add(furikaeRest).add(annualLeave);
			}

			absentHour = moment.duration(standardTime).subtract(actualWorkHour)
					.subtract(furikaeRest).subtract(annualLeave);
			if (absentHour < time0) {
				overTime = moment.duration(absentHour * -1);
				absentHour = time0;

			}

			if (overTime > moment.duration("13:30")) {
				msg = "overtime was exceed 13h30m";
			}

			nightWorkTime = time0
			if (exitTime > moment.duration("23:00")) {
				nightWorkTime = moment.duration(exitTime).subtract("23:00");
			}
		}

		data[5] = dateFormat(moment.duration(actualRest).format(timeFmt));
		data[9] = dateFormat(moment.duration(workHour).format(timeFmt));
		data[10] = dateFormat(moment.duration(actualWorkHour).format(timeFmt));
		data[11] = dateFormat(moment.duration(absentHour).format(timeFmt));
		data[12] = dateFormat(moment.duration(overTime).format(timeFmt));
		data[13] = dateFormat(moment.duration(nightWorkTime).format(timeFmt));
		data[14] = "";
		data[15] = dateFormat(moment.duration(workHourHoliday).format(timeFmt));
		data[16] = dateFormat(moment.duration(furikae).format(timeFmt));
		timeData[idx] = data;
	}
	callback(msg);
}

function dateFormat(iDate) {
	if (iDate == null || iDate <= 0)
		return "";

	var sDate = iDate.toString();
	return sDate.indexOf(":") == -1 ? "00:" + sDate : sDate;
}

function calFooterTime(tData, callback) {

	var footData = [];
	var tmpArr = [];
	for (var i = 5; i <= 15; i++) {
		footData[i] = moment.duration('00:00');
	}
	for (var day = 0; day < tData.length; day++) {
		for (var i = 5; i <= 15; i++) {
			footData[i].add(tData[day][i]);
		}
	}

	for (var i = 5; i <= 15; i++) {
		footData[i] = dateFormat(moment.duration(footData[i]).format(timeFmt));
	}

	footData[0] = "Total";
	callback(footData);
}



})(jQuery);
