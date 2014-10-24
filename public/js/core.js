/**
 * New node file
 */
// js/core.js

angular.module('scotchTodo', ['todoController', 'todoService']);

(function($){
$("document").ready(function(){
	$('#timemonth').datetimepicker({
		pickTime : false,
		minViewMode: "months",
		useCurrent: false
		
	})
	.on("dp.change",function (e) {
	    $("#timemonth input").change();
	 });
	
	var top = $('.ts-submit').offset().top;
	$('.ts-submit').affix({
	    offset: {
	      top: top + 20
	    }
	  })
})
})(jQuery);