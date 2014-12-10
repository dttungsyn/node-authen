'use strict'

/**
 * 
 */

var weekday = ["日", "月", "火","水","木","金","土"];
var defaultData = [
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
	{
		"name" : "平日通常残業",
		"defaultVal": "",
	},
	{
		"name" : "備考/Note (休みの種別など記入）",
		"defaultVal": "",
		"hide" : "phone,tablet",//phone,tablet
		"fieldType" : "textarea",
		"style": {
			"padding": 0
		}
	}
]

function getCurrentMonth(){
	
}

function getInputMonth(){
	return jQuery("#timemonth input").val();
}

function initMonthData(fieldset, mmObj ){
	mmObj = mmObj || moment();
	if (fieldset) defaultData = fieldset;
	
	var rs = {
		fields: [],
		data: []
	};
	
	var daysInMonth = mmObj.daysInMonth();
	for (var d = 1; d <= daysInMonth; d++){
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
		
		rs.data.push(data);
	}
	
	/*rs.fields = defaultData.map(function( field, i ){
		return {
			"name" : field.header,
			"hide" : field.hide || false, 
			"colStyle": field.colStyle || "",
			"fieldType": field.fieldType || "label",
			"style"	: field.style || "",
			"inputClass": field.inputClass || ""
		}
	})
	.filter(function( field , i ){
		return field.name[0] != '_';
	});*/
	
	return rs;
}

// after set month
function makeTimeTable(){
	/*
     * fooTable
     */
	$("#ts-table").attr("class", "");	// clear
    $("#ts-table").footable({
  	  toggleSelector: ' > tbody > tr:not(.footable-row-detail) > td:first-child',
  	  debug: true
    });
    //end footable
    
    $('.time-input').datetimepicker({
    	pickDate : false,
    	useCurrent: false,
    	pick12HourFormat: true,
    	format: "H:mm",
    	minuteStepping:5,  
    	direction: "bottom"
    });
}