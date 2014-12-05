/**
 * New node file
 */
// js/controllers/main.js
angular.module('todoController', [])
	

	// inject the Todo service factory into our controller
	.controller('mainController', function($scope, $http, Todos) {

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
		
		
		
		
		
		//TungDT ==================================================================
		
		//init
		$scope.formData  = {};
		$scope.timeDatas = {
			fields: [],
			data: {}
		};
		
		//get user info at first
		$http.get('/api/userdata').success(function(data) {
			$scope.formData.loginUser = data;		// store login user
			$scope.formData.user = data;	// user used to display
			$scope.formData.selectingUsername = data.local.username;	//selecting username
        })
        
        
        // Watch staff select TODO
		$scope.$watch(function() { 
			return $scope.formData.selectingUsername
		},
        function() {
			var username = $scope.formData.selectingUsername;
			if (!username) return;
			console.log("select changed! " + username);
			
			//http get selectingUsername, assign to 
			$http.get('/api/userdata/' + username).success(function(data) {
				$scope.formData.user = data;	// user used to display
				if ($scope.monthstr){
					$scope.getTimeData();
				}
	        });
			
			
		});
        
        
		
        //user form submit
		$scope.updateUser = function() {
			//reset message
			$scope.formData.user.updateSuccess = null ;
			$scope.formData.user.updateFail    = null ;
			$scope.formData.user.updating      = true;
			console.log( $scope.formData.user );
			
			//request update
			$http.post('/api/userdata/' + $scope.formData.user.local.username, $scope.formData.user)
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
			
			$http.post('/api/timedata/' + $scope.formData.user.local.username, {"monthstr": $scope.monthstr})	// monthstr: 2014-01
				.success( function ( data ){
					console.log( data );
					if ( data.success ){
						$scope.timeDatas.data  = data.timedata.data;
						$scope.timeDatas.fields = data.timedata.fieldset.fields;
					}
					else {
						$scope.timeDatas = initMonthData(moment( $scope.monthstr, "YYYY-MM" ));	//initMonthData: functions.js
						if (data.timedata.fieldset) $scope.timeDatas.fields = data.timedata.fieldset;	//get fields from server if possible
					}
					
					//save originalData to detect change
					$scope.originalData = JSON.parse(JSON.stringify($scope.timeDatas.data));
					
					//add today info timedata
					var today = moment();
					if ( today.format("YYYY-MM") == $scope.monthstr ){
						$scope.timeDatas.data[ today.date() - 1 ].today = true;
					}
					
					//end loading
					$scope.loadingTimeData = false;
				})
				
				.error(function(data) {
	                console.log('Error: ' + data);
		        });
				
		}
		
		// Save Time Data
		$scope.saveTimeData = function(){
			
			//show saving pin
			$scope.savingTimeData = true;
			
			//clear today info before save to database
			var today = moment();
			delete $scope.timeDatas.data[today.date()-1].today ;
			
			$http.post('/api/savetimedata/' + $scope.formData.user.local.username, {
				"monthstr": $scope.monthstr
				, "data"	  : $scope.timeDatas.data
				//, "fields"  : $scope.timeDatas.fields
			})	// monthstr: 2014-01
			.success( function ( data ){
				$scope.savingTimeData = false;
				$scope.formData.user.updateSuccess = data.message ;
                // clear the message after 5s
            	setTimeout(function(){
            		$scope.formData.user.updateSuccess = null;
            		$scope.$apply();
            	}, 5000);
            	
            	//add today info
				if ( today.format("YYYY-MM") == $scope.monthstr ) $scope.timeDatas.data[today.date()-1].today = true;
            	
				//update origin data to the latest
				$scope.originalData = {};
				$scope.originalData = JSON.parse(JSON.stringify($scope.timeDatas.data));
				
				console.log(data)
			})
			
			.error(function(data) {
				$scope.savingTimeData = false;
                console.log('Error: ' + data);
	        });
		}
		
		//calculate cell class
		$scope.cellClass = function(fieldName, index){
			//return field.name == '曜日' ? 'day-' + _wday : field.name == '日' ? 'date-' + _wday : '';
			
			var _wday = moment( $scope.monthstr, "YYYY-MM" ).date(index + 1).day();
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
		
		// create input class for a cell input
		// i: index of day
		// field: column information
		$scope.inputClass = function(i, field){
			var classes = [];
			
			if (field.inputClass) classes.push(field.inputClass);
			
			if ($scope.timeDatas.data[i][field.name] !== $scope.originalData[i][field.name]){
				classes.push("diff");
			}
			return classes;
		}
		
		
	});