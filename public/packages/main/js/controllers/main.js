/**
 * New node file
 */
// js/controllers/main.js
angular.module('todoController', [])
	

	// inject the Todo service factory into our controller
	.controller('mainController', function($scope, $http, Todos, TimeServices) {

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
			data: {},
			footData: []
		};
		
		$scope.hasStaff = false;
		$scope.staffs = [];
		$scope.states = {};
		
		//get user info at first
		$http.get('/api/userdata').success(function(data) {
			$scope.formData.loginUser = data;		// store login user
			$scope.formData.user = data;	// user used to display
			$scope.formData.selectingUsername = data.local.username;	//selecting username
			
			$scope.staffs = data.staffs;
			
			$scope.hasStaff = $scope.staffs && $scope.staffs.length > 0;
			
			//add this person to the staff list 
			if (data.staffs.length > 0)
				$scope.staffs.unshift({
					_id: data._id,
					fullname: data.fullname,
					local: {
						username: data.local.username
					}
				});
			
			
			
        })
        
        
        // select staff
		$scope.$watch(function() {
			return $scope.formData.selectingUsername
		},
        function() {
			var username = $scope.formData.selectingUsername;
			if (!username) return;
			
			//http get selectingUsername, assign to 
			$http.get('/api/userdata/' + username).success(function(data) {
				$scope.formData.user = data;	// user used to display
				if ($scope.monthstr){
					$scope.getTimeData(false);//get time data without other staff's state
				} else {
					// default to current month
					$scope.monthstr = moment().format("YYYY-MM");
					$scope.getTimeData(true);//first, get time data with other staff's state
				}
	        });
			
			
		});
		
		$scope.selectStaff = function( username ){
			if ( !$scope.multiview ) {
				$scope.formData.selectingUsername = username;
				$('.selectpicker').val(username);
				$('.selectpicker').selectpicker('refresh');
			}
			else {
				$scope.multiViewToggle( username );
			}
		}
        
        
		
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
		
		/**
		 * get Time data after set month, or select user
		 * getState: boolean //get other staff'state of this month or not 
		 */
		$scope.getTimeData = function(getState) {
			var isGetState = getState || false;
			var staffs = [];
			if (isGetState){
				staffs = $scope.staffs || [];
				
				staffs = staffs.map(function(val, i){
					return val.local.username;
				})
				
				//init states
				for (var i = 0; i < staffs.length; i ++){
					$scope.states[ staffs[i] ] = -1;
				}
				
				//update states
				TimeServices.getTimeDataState(staffs, $scope.monthstr, function( states ){
					$.extend( $scope.states, states );
					console.log( $scope.states );
				});
			}
			
			//show loading pin
			$scope.loadingTimeData = true;
			
			$http.post('/api/timedata/' + $scope.formData.user.local.username, {
				"monthstr": $scope.monthstr,
				"staffs": staffs
				})	// monthstr: 2014-01
				.success( function ( data ){
					console.log( data );
					if ( data.success ){
						$scope.timeDatas.data  = data.timedata.data;
						$scope.timeDatas.fields = data.timedata.fieldset.fields;
						$scope.timeDatas.state = data.timedata.state;
						
						$scope.states[ $scope.formData.user.local.username ] = data.timedata.state; //in case of normal user
						
						FptTIME.addDay2MonthData(data.timedata.fieldset.fields, moment( $scope.monthstr, "YYYY-MM" ), data.timedata.data);	// addDay2MonthData: functions.js
					}
					//not found, init data if own timesheet
					else if ($scope.formData.loginUser.local.username == $scope.formData.user.local.username){
						$scope.timeDatas.data = FptTIME.initMonthData(data.timedata.fieldset, moment( $scope.monthstr, "YYYY-MM" )).data;	//initMonthData: functions.js
						if (data.timedata.fieldset) $scope.timeDatas.fields = data.timedata.fieldset;	//get fields from server if possible
						$scope.timeDatas.state = 0;
					} else {
						//dont display
						$scope.timeDatas.data = null;
					}
					
					//check state > 0
					
					if ($scope.timeDatas.data){
						//save originalData to detect change
						$scope.originalData = JSON.parse(JSON.stringify($scope.timeDatas.data));
						
						//add today info timedata
						var today = moment();
						if ( today.format("YYYY-MM") == $scope.monthstr ){
							$scope.timeDatas.data[ today.date() - 1 ].today = true;
						}
						
						//first time calculate
						FptTIME.calculateTime($scope.timeDatas.data, "all", function(err){
							if (err) {
								$scope.formData.user.updateWarn = err;
				                // clear the message after 5s
				            	setTimeout(function(){
				            		$scope.formData.user.updateWarn = null;
				            		$scope.$apply();
				            	}, 5000);
							}
							FptTIME.calFooterTime($scope.timeDatas.data,function(footData){
								//console.log(footData);
								$scope.timeDatas.footData = footData;
								//$scope.$apply();
							});
							
						});
					}
					
					//end loading
					$scope.loadingTimeData = false;
				})
				
				.error(function(data) {
	                console.log('Error: ' + data);
		        });
				
		}
		
		// export time data
		$scope.exportTimeData = function(){
			console.log($scope.timeDatas.data);
			console.log(typeof($scope.timeDatas.data));
			$http.post('/api/exporttimedata/' + $scope.formData.user.local.username, {
				"monthstr": $scope.monthstr
				, "data"	  : $scope.timeDatas.data
			})	
			.success( function ( data ){
				
				console.log(data)
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
			if ( today.format("YYYY-MM") == $scope.monthstr ) delete $scope.timeDatas.data[today.date()-1].today ;
			
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
		
		//approve, apply handler
		var _success = function(username, state, msg){
			$scope.formData.user.updateSuccess = msg ;
            // clear the message after 5s
        	setTimeout(function(){
        		$scope.formData.user.updateSuccess = null;
        		$scope.$apply();
        	}, 5000);
        	$scope.timeDatas.state = state;
        	$scope.states[ username ] = state;
		};
		
		$scope.approve = function(username, monthstr){
			if ($scope.states[ username ] != 1) return;
			monthstr = monthstr || $scope.monthstr;
			
			TimeServices.approve(username, monthstr, function(data){
				_success(username, data.newState, "Approve Success");
			})
		}
		
		$scope.unapprove = function(username, monthstr){
			if ($scope.states[ username ] != 2) return;
			monthstr = monthstr || $scope.monthstr;
			
			TimeServices.unapprove(username, monthstr, function(data){
				_success(username, data.newState, "Unapprove Success");
			})
		}
		
		$scope.apply = function(username, monthstr){
			if ($scope.states[ username ] != 0) return;
			monthstr = monthstr || $scope.monthstr;
			
			TimeServices.approve(username, monthstr, function(data){
				_success(username, data.newState, "Apply Success");
			})
		}
		
		$scope.unapply = function(username, monthstr){
			if ($scope.states[ username ] != 1) return;
			monthstr = monthstr || $scope.monthstr;
			
			console.log( username );
			
			TimeServices.unapprove(username, monthstr, function(data){
				_success(username, data.newState, "Unapply Success");
			})
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
		// ind: field's index
		$scope.inputClass = function(i, field, ind){
			var classes = [];
			
			if (field.inputClass) classes.push(field.inputClass);
			
			if ($scope.timeDatas.data[i][ind] !== $scope.originalData[i][ind]){
				classes.push("diff");
			}
			return classes;
		}
		
		
		//data change event - TODO move to fptTime.js
		$('#ts-table').on('change', 'input', function(e){
			var index = $(e.target).closest('tr').index();
			//apply
			FptTIME.calculateTime($scope.timeDatas.data, index, function(err){
				if (err) {
					$scope.formData.user.updateWarn = err;
	                // clear the message after 5s
	            	setTimeout(function(){
	            		$scope.formData.user.updateWarn = null;
	            		$scope.$apply();
	            	}, 5000);
				}
				FptTIME.calFooterTime($scope.timeDatas.data,function(footData){
					//console.log(footData);
					$scope.timeDatas.footData = footData;
					$scope.$apply();
				});
				
			});
			
			
		});
		
		FptTIME.assignChangeTabEventHandler( $scope );
		
		
		/*
		 * Multiple Users View Tab
		 */
		$scope.mutliview = false;
		$scope.multiViewSelecting = [];
		$scope.multiViewData = {};
		$scope.multiViewAdd = function( username ){
			$scope.multiViewSelecting.push( username );
		};
		$scope.multiViewRemove = function( username ){
			var ind = multiViewSelecting.indexOf( username );
		};
		$scope.multiViewCheck = function( username ){
			return $scope.multiViewSelecting.indexOf( username ) > -1;
		};
		$scope.multiViewToggle = function( username ){
			var idx = $scope.multiViewSelecting.indexOf(username);

		    // is currently selected
		    if (idx > -1) {
		      $scope.multiViewSelecting.splice(idx, 1);
		    }

		    // is newly selected
		    else {
		      $scope.multiViewSelecting.push(username);
		      
		      // load sum data
		      TimeServices.getSumData(username, $scope.monthstr, function( sumData, state ){
		    	  $scope.multiViewData[ username ] =  sumData;
		    	  //update state
		    	  $scope.states[ username ] = state;
		    	  console.log( sumData );
		      });
		      //$scope.monthstr
		    }
		    
		    //console.log( $scope.multiViewSelecting );
		}
		$scope.multiViewHeaders = TimeServices.getSumHeaders();
		$scope.multiViewShowDetail = function( user ){
			$scope.mutliview = false;
			$('#myTab a:first').tab('show');
			$scope.selectStaff( user );
		}
	});