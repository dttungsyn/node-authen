/**
 * New node file
 */
// js/services/todos.js
angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			"delete" : function(id) {
				//return $http.delete('/api/todos/' + id);
			}
		}
	})
	
	.factory('TimeServices', TimeServices)
	
	.directive('onLastRepeat', function($timeout) {
        return function(scope, element, attrs) {	// this is link by default
            if (scope.$last) $timeout(function(){
                //console.log(scope);
                FptTIME.makeTimeTable();
                //scope.loadingTimeData = false;
            });
        };
    });

function TimeServices($http){
	
	var updateStateHandler = function(data, cb){
		cb(data);
	}
	
	return {
		getSumData: function(username, monthstr, cb){
			$http.post('/api/timedata/' + username, {
				"monthstr": monthstr,
				"staffs": []
				})	// monthstr: 2014-01
				.success( function ( data ){
					var timeData = data.timedata.data;
					var state = data.timedata.state;
					if ( !timeData ){
						cb( [0,0,0,0], -1 );
						return;
					}
					FptTIME.calculateTime(timeData, "all", function(err){
						if (err) {
							$scope.formData.user.updateWarn = err;
			                // clear the message after 5s
			            	setTimeout(function(){
			            		$scope.formData.user.updateWarn = null;
			            		$scope.$apply();
			            	}, 5000);
						}
						FptTIME.calFooterTime(timeData,function(footData){
							//console.log(footData);
							var _extractInd = [5, 9, 10, 11];
							var sumData = [];
							for (var i = 0; i < _extractInd.length; i ++){
								var ind = _extractInd[ i ];
								sumData.push( footData[ind] );
							}
							cb( sumData, state );
						});
						
					});
				});
		},
		
		getSumHeaders: function(){
			return ['休憩', '実働', 'Working Siteでの実働', '平日無給']
		},
		
		approve: function( user, monthstr, cb ){
			var url = '/api/approve-timedata/';
			$http.post(url + user, {
				"monthstr": monthstr
			})	// monthstr: 2014-01
			.success( function(data){
				updateStateHandler(data, cb);
			});
		},
		//now
		unapprove: function( user, monthstr, cb ){
			var url = '/api/unapprove-timedata/';
			$http.post(url + user, {
				"monthstr": monthstr
			})	// monthstr: 2014-01
			.success( function(data){
				updateStateHandler(data, cb);
			});
		},
		
		getTimeDataState: function( users, monthstr, cb ){
			$http.post('/api/get-timedata-states/', {
				"users": users,
				"monthstr": monthstr
			})	// monthstr: 2014-01
			.success( function(states){
				cb( states );
			});
		}
	}
}