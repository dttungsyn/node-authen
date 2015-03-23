/**
 * @author fpt-dev
 */
angular.module('adminModule', [])
	.controller('adminController', ['$scope', 'AdminServices', function( $scope ) {
	
	}]
	)
	.factory('AdminServices', function($scope, $http) {
		return {
			getAllStaffInfo: function(){
				
			}
		}
	})
	