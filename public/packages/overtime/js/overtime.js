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
			totalOneDay = moment.duration(otHoliday).add(workOnRestDay).format("h:mm");
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
	
	var footData = [];
	for (var i = 4; i <= 9; i++) {
		footData[i] = moment.duration('00:00');
	}
	
	footData[12] = moment.duration('00:00');
	
	for (var day = 0; day < otData.length; day++) {
		for (var i = 4; i <= 9; i++) {
			footData[i].add(otData[day][i]);
		}
		footData[12].add(otData[day][12]);
	}

	for (var i = 4; i <= 9; i++) {
		footData[i] = dateFormat(moment.duration(footData[i]).format("H:mm"));
	}

	footData[12] = dateFormat(moment.duration(footData[12]).format("H:mm"));
	
	footData[0] = "Total";
	//callback(footData);
	
	return footData;
}
