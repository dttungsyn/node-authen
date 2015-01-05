/**
 * Overtime controller parent: mainController
 */

angular
		.module('todoController')
		.controller(
				'overTimeController',
				[
						'$scope',
						function($scope) {
							var timeData = $scope.$parent.timeDatas.data;
							var yearMonth = $scope.$parent.monthstr;

							// $scope.overTimeData = abc(timedata);
							// console.log('go here');
							$scope.overTimeData = {
								headers : [ "申請日", "勤務日", "曜日", "時間外休日労働時間帯",
										"平日通常残業", "平日深夜残業", "土祝実働", "日曜実働",
										"振替休日", "振替休日対象の休日出勤", "時間外休日労働の事由",
										"承認印", "実働時間", "申請者のサイン", "承認印　" ],
								data : [ "", "", "", "", "", "", "", "", "",
										"", "", "", "", "", "" ],
								footers : [ "Total", "", "", "", "", "", "",
										"", "", "", "", "", "", "", "" ]
							};

							$scope
									.$watch(
											function() {
												return timeData = $scope.$parent.timeDatas.data;
											},
											function() {
												console
														.log("Time data changed-ot!");
												$scope.overTimeData.data = getOTData(timeData);
												$scope.overTimeData.footers = calFooter($scope.overTimeData.data);
											});
						} ])

		.directive(
				'onOtLastRepeat',
				function() {
					return function(scope, element, attrs) { // this is link
						// by default
						if (scope.$last)
							setTimeout(
									function() {
										// console.log(scope);
										$("#ot-table").attr("class", ""); // clear
										$("#ot-table")
												.footable(
														{
															toggleSelector : ' > tbody > tr:not(.footable-row-detail) > td:first-child',
															debug : true
														});
										// scope.loadingTimeData = false;
									}, 5);
					};
				});

// Each bar represents a single discrete quantity.
function getOTData(timeData) {

	console.log('timeData');
	console.log(timeData);

	if (timeData === null || timeData == "")
		return [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];

	var day = 0;
	var dayData;

	var otData = [];
	var otDay, otDate, workTime, otTimeDay, otTimeNight, otHoliday, workSun, ot2RestDay, workOnRestDay, remark, totalOneDay;
	for (day = 0; day < timeData.length; day++) {
		data = timeData[day];

		if (data[12] === "" && data[14] === "")
			continue;

		// get col : 0,0,1,3+'～'+4,12,13,14,15,7,16,17
		otDay = data[0];
		otDate = data[1];
		workTime = data[3] + ' ～ ' + data[4];
		otTimeDay = data[12];
		otTimeNight = data[13];
		otHoliday = data[14];
		workSun = data[15];
		ot2RestDay = data[7];
		workOnRestDay = data[16];
		remark = data[17];

		if (otTimeDay != "") {
			totalOneDay = otTimeDay;
		} else if (otHoliday != "") {
			totalOneDay = moment.duration(otHoliday).add(workOnRestDay).format("hh:mm");
		}

		otData.push([ otDay, otDay, otDate, workTime, otTimeDay, otTimeNight,
				otHoliday, workSun, ot2RestDay, workOnRestDay, remark, "",
				totalOneDay, "", "" ]);
	}

	if (otData == "") {
		return [ "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" ];
	}

	return otData;

}

function calFooter(otData) {

	// console.log('otData');
	// console.log(otData);

	if (otData == "")
		return ([ "Total", "", "", "", "", "", "", "", "", "", "", "", "", "",
				"" ]);

	var day = 0;
	var dayData;

	var footData = [];
	var otTimeDay = otData[0][4];
	var otTimeNight = otData[0][5];
	var otHoliday = otData[0][6];
	var workSun = otData[0][7];
	var ot2RestDay = otData[0][8];
	var workOnRestDay = otData[0][9];
	var totalOneDay = moment.duration(otData[0][12]);

	for (day = 1; day < otData.length; day++) {
		var data = otData[day];

		console.log("totalOneDay - " + day + " : "
				+ totalOneDay.format("hh:mm"));
		otTimeDay = moment.duration(otTimeDay).add(data[4]);
		otTimeNight = moment.duration(otTimeNight).add(data[5]);
		otHoliday = moment.duration(otHoliday).add(data[6]);
		workSun = moment.duration(workSun).add(data[7]);
		ot2RestDay = moment.duration(ot2RestDay).add(data[8]);
		workOnRestDay = moment.duration(workOnRestDay).add(data[9]);
		totalOneDay = moment.duration(totalOneDay).add(data[12]);
	}

	var sub = workOnRestDay >= ot2RestDay ? ot2RestDay : workOnRestDay;

	totalOneDay = moment.duration(totalOneDay).subtract(sub);
	/*
	 * otTimeDay = otTimeDay.hours() + ':' + otTimeDay.minutes(); otTimeNight =
	 * otTimeNight.hours() + ':' + otTimeNight.minutes(); otHoliday =
	 * otHoliday.hours() + ':' + otHoliday.minutes(); workSun = workSun.hours() +
	 * ':' + workSun.minutes(); ot2RestDay = ot2RestDay.hours() + ':' +
	 * ot2RestDay.minutes(); workOnRestDay = workOnRestDay.hours() + ':' +
	 * workOnRestDay.minutes(); totalOneDay = totalOneDay.hours() + ':' +
	 * totalOneDay.minutes();
	 */
	var format = "HH:mm"
	footData.push("Total", "", "", "", otTimeDay.format(format), otTimeNight
			.format(format), otHoliday.format(format), workSun.format(format),
			ot2RestDay.format(format), workOnRestDay.format(format), "", "",
			totalOneDay.format(format), "", "");
	console.log('final result : ' + footData);

	return footData;
}
