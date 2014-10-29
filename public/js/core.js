/**
 * New node file
 */
// js/core.js

angular.module('scotchTodo', ['todoController', 'todoService', 'nvd3ChartDirectives']);

(function($){
$("document").ready(function(){
	//======= init layout ==========
	
	//set month picker
	$('#timemonth').datetimepicker({
		pickTime : false,
		minViewMode: "months",
		useCurrent: false
		
	})
	.on("dp.change",function (e) {
	    $("#timemonth input").change();
	});
	
	//save button affix
	var top = $('.ts-submit').offset().top;
	$('.ts-submit').affix({
	    offset: {
	      top: top + 20
	    }
	})
	
	//tab change event
	$('.bs-timesheet a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  if ( $(e.target).attr("href") == "#home" ){
		  // update time table
		  console.log("update time table");
		  $("#ts-table").resize();
	  } 
	  else if ( $(e.target).attr("href") == "#chart" ){
		  // update chart
		  console.log("update chart");
	  }
	  //console.log(e.relatedTarget) // previous tab
	})
	
})
})(jQuery);