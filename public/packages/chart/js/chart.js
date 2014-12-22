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
					nv.addGraph(function() {
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
						.axisLabel('日').tickFormat(function(d) {
							return d + "日";
						});

						chart.yAxis //Chart y-axis settings
						.axisLabel('時間').tickFormat(function(d) {
							var hour = Math.floor(d);
							var minute = Math.round((d - hour) * 60);
							minute = minute > 9 ? "" + minute : "0" + minute;
							return hour + ":" + minute;
						});

						var timeData = $scope.$parent.timeDatas.data;
						var yearMonth = $scope.$parent.monthstr;

						d3.select('#chart svg') //Select the <svg> element you want to render the chart in.   
						.datum(exampleData(timeData)) //Populate the <svg> element with chart data...
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
										exampleData(timeData)).call(chart);

							}, 500);

						});

						fpttime.chart = chart;	//expose to global to update when tab change
						return chart;
					});

				} ])

//Each bar represents a single discrete quantity.
function exampleData(timeData) {

	console.log(timeData);

	var day = 0;
	var time;

	var timeIn = [];
	var timeOut = [];
	var temp = [];

	for (day = 0; day < timeData.length; day++) {
		time = timeData[day];
		if (time[3] == "")
			continue;
		temp = time[3].split(":");
		timeIn.push({
			x : day + 1,
			y : parseInt(temp[0]) + parseInt(temp[1]) / 60
		});
		temp = time[4].split(":");
		timeOut.push({
			x : day + 1,
			y : parseInt(temp[0]) + parseInt(temp[1]) / 60
		});
	}
	return [ {
		values : timeIn,
		key : '出社',
		color : 'blue'
	}, {
		values : timeOut,
		key : '退社',
		color : 'red'
	} ];

}