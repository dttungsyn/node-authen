/**
 * New node file
 */
// js/core.js

angular.module('scotchTodo', ['todoController', 'todoService', 'nvd3ChartDirectives']);

(function($){
	
var fpttime = window.fpttime || {};


fpttime.version = '1.0';
fpttime.dev = true //set false when in production

window.fpttime = fpttime;

$("document").ready(function(){
	//======= init layout ==========
	
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
			console.log( name_bar_top );
		});
		
		//staff list
		$('.list-group').affix({
		    offset: {
		      top: function(){
		    	  if ( $('.list-group').hasClass('affix') )
		    		  return list_group_top;
		    	  
		    	  return $('.list-group').offset().top - 60;
		    	  
		    	  
		      }
		    }
		})
		var list_group_top;
		$('.list-group').on('affix.bs.affix', function(){
			list_group_top = $('.list-group').offset().top - 60;
			console.log( list_group_top );
		});
		
		
	}, 1000);
	
	
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
		  fpttime.chart.update();
	  }
	  //console.log(e.relatedTarget) // previous tab
	})
	
	$('.selectpicker').selectpicker();
	
	$('select.selectpicker').on('change', function(){
        var selected = $('.selectpicker option:selected').val();
        $('.selectstaff').val(selected);	//element that is bind with ng-model
        $('.selectstaff').change();
        //console.log(selected);
     });
	
})
})(jQuery);