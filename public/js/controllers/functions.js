var weekday = ["日", "月", "火","水","木","金","土"];
var defaultData = [
	{
		"header" : "_day",
		"defaultVal": function(mmObj){
			return mmObj.date();
		}
	},
	{
		"header" : "_wday",
		"defaultVal": function(mmObj){
			return mmObj.day();
		}
	},
	{
		"header" : "日",
		"defaultVal": function(mmObj){
			return mmObj.format("MM月DD日");
		},
		"colStyle": {
			"width" : "150px"
		}
	},
	{
		"header" : "曜日",
		"defaultVal": function(mmObj){
			return weekday[ mmObj.day() ]
		},
		"colStyle": {
			"width" : "100px"
		}
	},
	{
		"header" : "休日",
		"defaultVal": "",
		"hide" : true
	},
	{
		"header" : "出社",
		"defaultVal": "9:00",
		"defaultValWend": "",
		"fieldType"  : "input",
		"inputClass" : "time-input",
		"style": {
			"padding": 2
		}
	},
	{
		"header" : "退社",
		"defaultVal": "18:00",
		"defaultValWend": "",
		"fieldType" : "input",
		"inputClass" : "time-input",
		"style": {
			"padding": 2
		}
	},
	{
		"header" : "休憩",
		"defaultVal": "1:00",
		"defaultValWend": "",
		"fieldType" : "input",
		"inputClass" : "time-input",
		"style": {
			"padding": 2
		}
	},
	{
		"header" : "有給休暇",
		"defaultVal": "",
		"hide" : true
	},
	{
		"header" : "実働",
		"defaultVal": "",
		"hide" : true
	},
	{
		"header" : "平日無給",
		"defaultVal": "",
		"hide" : true
	},
	{
		"header" : "平日通常残業",
		"defaultVal": "",
	},
	{
		"header" : "備考/Note (休みの種別など記入）",
		"defaultVal": "",
		"hide" : true,
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

function initMonthData( mmObj ){
	mmObj = mmObj || moment();
	
	var rs = {
		fields: [],
		data: []
	};
	
	var daysInMonth = mmObj.daysInMonth();
	for (var d = 1; d <= daysInMonth; d++){
		var date = mmObj.date(d); 
		/*rs.data.push({
			"_day" : d,
			"_wday": date.day(),
			"日"  : date.format("MM月DD日"),
			"曜日" : weekday[ date.day() ],
			"休日" : "",
			"出社" : "9:00",
			"退社" : "18:00",
			"休憩" : "1:00"
		});*/
		
		var data = new Object();
		defaultData.forEach(function(field, i){
			data[field.header] = typeof field.defaultVal === 'function' ? field.defaultVal(date) : field.defaultVal;
			if ( ( date.day() == 0 || date.day() == 6 ) && field.defaultValWend != null ){
				data[field.header] = typeof field.defaultValWend === 'function' ? field.defaultValWend(date) : field.defaultValWend;
			}
		});
		
		rs.data.push(data);
	}
	
	rs.fields = defaultData.map(function( field, i ){
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
	});
	
	return rs;
}

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