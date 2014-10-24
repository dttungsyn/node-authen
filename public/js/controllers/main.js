/**
 * New node file
 */
// js/controllers/main.js
angular.module('todoController', [])
	.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                console.log(scope);
                makeTimeTable();
                //scope.loadingTimeData = false;
            }, 5);
        };
    })

	// inject the Todo service factory into our controller
	.controller('mainController', function($scope, $http, Todos) {
		$scope.formData  = {};
		$scope.timeDatas = {
			fields: [],
			data: {}
		};

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
		/*Todos.get()
			.success(function(data) {
				$scope.todos = data;
			});*/

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			// people can't just hold enter to keep adding the same to-do anymore
			if (!$.isEmptyObject($scope.formData)) {

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			/*Todos.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.todos = data; // assign our new list of todos
				});*/
		};
		
		//TungDT
		//get user info at first
		$http.get('/api/userdata').success(function(data) {
			$scope.formData.user = data;
        })
        
        
		
        //user form submit
		$scope.updateUser = function() {
			//reset message
			$scope.formData.user.updateSuccess = null ;
			$scope.formData.user.updateFail    = null ;
			$scope.formData.user.updating      = true;
			console.log( $scope.formData.user );
			
			//request update
			$http.post('/api/userdata', $scope.formData.user)
	            .success(function(data) {
	            	$scope.formData.user.updateSuccess = data.message ;
	            	$scope.formData.user.updating      = null;
	                // clear the message after 5s
	            	setTimeout(function(){
	            		$scope.formData.user.updateSuccess = null;
	            		$scope.$apply();
	            	}, 5000);
	            })
		        .error(function(data) {
		        	$scope.formData.user.updateFail    = "Error" ;
		        	$scope.formData.user.updating      = null;
	                console.log('Error: ' + data);
		        });
		}
		
		// get Time data after set month
		$scope.getTimeData = function() {
			
			//show loading pin
			$scope.loadingTimeData = true;
			
			$http.post('/api/timedata', {"monthstr": $scope.monthstr})	// monthstr: 2014-01
				.success( function ( data ){
					console.log( data );
					if ( data.success ){
						$scope.timeDatas.data  = data.timedata.data;
						$scope.timeDatas.fields = data.timedata.fields;
					}
					else {
						$scope.timeDatas = initMonthData(moment( $scope.monthstr, "YYYY-MM" ));
					}
					
					//add today info
					var today = moment().date();
					$scope.timeDatas.data[today-1].today = true;
					
					//end loading
					$scope.loadingTimeData = false;
				})
				
				.error(function(data) {
	                console.log('Error: ' + data);
		        });
				
		}
		
		$scope.cellClass = function(fieldName, _wday){
			//return field.name == '曜日' ? 'day-' + _wday : field.name == '日' ? 'date-' + _wday : '';
			var classes = [];
			if (fieldName == '曜日'){
				classes.push('day-' + _wday);
			} 
			else if (fieldName == '日'){
				if (_wday == 0) 
					classes.push('bg-danger'); //Sunday
				else if (_wday == 6)
					classes.push('bg-success'); //Sat
			}
			
			return classes
		}
		
		// Save Time Data
		$scope.saveTimeData = function(){
			
			//show saving pin
			$scope.savingTimeData = true;
			
			$http.post('/api/savetimedata', {
				"monthstr": $scope.monthstr,
				"data"	  : $scope.timeDatas.data,
				"fields"  : $scope.timeDatas.fields
			})	// monthstr: 2014-01
			.success( function ( data ){
				$scope.savingTimeData = false;
				$scope.formData.user.updateSuccess = data.message ;
                // clear the message after 5s
            	setTimeout(function(){
            		$scope.formData.user.updateSuccess = null;
            		$scope.$apply();
            	}, 5000);
				console.log(data)
			})
			
			.error(function(data) {
				$scope.savingTimeData = false;
                console.log('Error: ' + data);
	        });
		}
		
		
	});