/**
 * @author fpt-dev
 */
angular.module('adminModule', [])
	.controller('adminController', ['$scope', 'adminServices', function( $scope, adminServices ) {
		$scope.columns = [];
		$scope.tableData = [];
		$scope.openUserInd = 0;
		$scope.save = function(){
			
			//close modal
			
			//save
			var userData = $scope.tableData[ $scope.openUserInd ];
			var columns = $scope.columns;
			adminServices.saveUserData( userData, columns);
			
			//reload - no need
		}
	}]);