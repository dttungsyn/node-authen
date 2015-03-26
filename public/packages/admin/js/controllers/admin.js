/**
 * @author fpt-dev
 */
angular.module('adminModule', [])
	.controller('adminController', ['$scope', 'adminServices', function( $scope, adminServices ) {
		$scope.fixColumns = [];
		$scope.customColumns = [];
		$scope.tableData = [];
		$scope.openUserInd = 0;
		$scope.openUser = null;
		$scope.save = function(){
			
			//close modal
			$('#myModal').modal('hide');
			
			//save
			var userData = $scope.openUser;
			var customColumns = $scope.customColumns;
			adminServices.saveUserData( userData, customColumns, function(data){
				console.log( data );
			});
			
			//reload / update dataTable
			adminServices.datatable.draw();
		}
		
		//debug
		 
	}]);