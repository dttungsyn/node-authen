/**
 * Angular chart controller
 * parent: mainController
 */

angular.module('todoController').controller(
		'chartController',
		[
				'$scope',
				function($scope) {

					var fpttime = window.fpttime || {};
					window.fpttime = fpttime;

					/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
					nv
							.addGraph(function() {
								var chart = nv.models.lineChart().margin({
									left : 100
								}) //Adjust chart margins to give the x-axis some breathing room.
								.useInteractiveGuideline(true) //We want nice looking tooltips and a guideline!
								.transitionDuration(350) //how fast do you want the lines to transition?
								.showLegend(true) //Show the legend, allowing users to turn on/off line series.
								.showYAxis(true) //Show the y-axis
								.showXAxis(true) //Show the x-axis
								;

								chart.xAxis //Chart x-axis settings
								.axisLabel('日').tickFormat(d3.format(',r'));
								
								chart.yAxis //Chart y-axis settings
								.axisLabel('時間').tickFormat(function(d){
									var hour = Math.floor( d );
									var minute = Math.floor((d-hour)*60);
									minute = minute > 9 ? "" + minute: "0" + minute;
									return hour + ":" + minute;
								});

								var timeData = $scope.$parent.timeDatas.data;
								var yearMonth = $scope.$parent.monthstr;

								d3.select('#chart svg') //Select the <svg> element you want to render the chart in.   
								.datum(exampleData(timeData, yearMonth)) //Populate the <svg> element with chart data...
								.call(chart); //Finally, render the chart!

								//Update the chart when window resizes.
								nv.utils.windowResize(function() {
									chart.update()
								});
								
								$scope.$watch(function() {
									return $scope.$parent.timeDatas.data;
								}, function() {

									console.log("Time data changed!");

									//update chart
									setTimeout(function() {
										var timeData = $scope.$parent.timeDatas.data;
										var yearMonth = $scope.$parent.monthstr;
										d3.select('#mychart svg').datum(
												exampleData(timeData, yearMonth)).call(
												chart);

									}, 500);

								});
								
								return chart;
							});

				} ])

//Each bar represents a single discrete quantity.
function exampleData(timeData, yearMonth) {

	console.log(timeData);
	
	var day = 0;
	var time;
	
	var timeIn = [];
	var timeOut = [];
	var temp = [];
	
	for(day=0; day<timeData.length; day++){
		time = timeData[day];
		if(time[3] == "") continue;
		temp = time[3].split(":");
		timeIn.push({x:day+1,y:parseInt(temp[0]) + parseInt(temp[1])/60});
		temp = time[4].split(":");
		timeOut.push({x:day+1,y:parseInt(temp[0]) + parseInt(temp[1])/60});
	}
	return [{values:timeIn,key:'出社',color:'blue'},{values:timeOut,key:'退社',color:'red'}];
//	return [
//	        {
//	          values: [{x:1,y:9.5},{x:2,y:10},{x:3,y:9},{x:4,y:9.5},{x:5,y:9},{x:6,y:10},{x:7,y:9},{x:8,y:10},{x:9,y:9},{x:10,y:10},{x:11,y:9},{x:12,y:10},{x:13,y:9},{x:14,y:10}],
//	          key: 'in',
//	          color: 'blue'
//	        },
//	        {
//	          values: [{x:1,y:19},{x:2,y:20},{x:3,y:19},{x:4,y:18},{x:5,y:15},{x:6,y:17},{x:7,y:19},{x:8,y:20},{x:9,y:19},{x:10,y:18},{x:11,y:19},{x:12,y:20},{x:13,y:22},{x:14,y:21}],
//	          key: 'out',
//	          color: 'red'
//	        },
//	        {
//	          values: [{x:1,y:9},{x:2,y:9},{x:3,y:9},{x:4,y:7.5},{x:5,y:8},{x:6,y:6},{x:7,y:9},{x:8,y:9},{x:9,y:9},{x:10,y:7},{x:11,y:9},{x:12,y:9},{x:13,y:12.5},{x:14,y:10}],
//	          key: 'in work',
//	          color: 'yellow',
//	          area : true
//	        },
//	        {
//	          values: [{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:1},{x:8,y:1},{x:9,y:1},{x:10,y:0},{x:11,y:1},{x:12,y:1},{x:13,y:4.5},{x:14,y:2}],
//	          key: 'ot',
//	          color: 'green',
//	          area : true
//	        }
//	      ];

}