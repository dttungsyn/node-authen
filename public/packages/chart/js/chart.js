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

					//d3.json('stackedAreaData.json', function(dataTest) {
					nv.addGraph(function() {

						var chart = nv.models.stackedAreaChart().margin({
							right : 100
						}).x(function(d) {
							return d[0];
						}) //We can modify the data accessor functions...
						.y(function(d) {
							return d[1];
						}) //...in case your data is formatted differently.
						.useInteractiveGuideline(true) //Tooltips which show all data points. Very nice!
						.rightAlignYAxis(true) //Let's move the y-axis to the right side.
						.transitionDuration(500).showControls(true) //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
						.clipEdge(true);

						//Format x-axis labels with custom function.
						chart.xAxis.tickFormat(function(d) {
							//return d3.time.format('%x')(new Date(d));
							return d+"日";
						});

						chart.yAxis.tickFormat(d3.format(',.2f'));

						var timeData = $scope.$parent.timeDatas.data;
						var yearMonth = $scope.$parent.monthstr;
						d3.select('#chart svg').datum(
								exampleData(timeData, yearMonth)).call(chart);

						nv.utils.windowResize(chart.update);

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

						fpttime.chart = chart;

						return chart;
					});

				} ])

//Each bar represents a single discrete quantity.
function exampleData(timeData, yearMonth) {
	console.log(yearMonth);
	console.log(timeData);
	return [
			{
				"key" : "出社",
				"values" : [ [ 1, 9 ], [ 2, 9 ],
						[ 3, 9 ], [ 4, 9 ],
						[ 5, 9 ], [ 6, 0 ],
						[ 7, 0 ], [ 8, 9 ],
						[ 9, 9 ], [ 10, 9 ],
						[ 11, 9 ], [ 12, 9 ] ],
						"color": "#ffffff"
			},

			{
				"key" : "出社",
				"values" : [ [ 1, 9 ], [ 2, 9 ],
						[ 3, 9 ], [ 4, 9 ],
						[ 5, 9 ], [ 6, 0 ],
						[ 7, 0 ], [ 8, 9 ],
						[ 9, 9 ], [ 10, 9 ],
						[ 11, 9 ], [ 12, 9 ] ]
			},

			{
				"key" : "出社",
				"values" : [ [ 1, 1 ], [ 2, 0 ],
						[ 3, 2 ], [ 4, 3 ],
						[ 5, 1 ], [ 6, 0 ],
						[ 7, 0 ], [ 8, 2 ],
						[ 9, 2 ], [ 10, 0 ],
						[ 11, 0 ], [ 12, 1 ] ]
			}

	];

}