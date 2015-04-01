/**
 * @author fpt-dev
 */
angular.module('adminModule')

	.directive('staffDataTable', ['$timeout', '$http', 'adminServices', function($timeout, $http, adminServices) {
		
		console.log('directive run');
		
		function link(scope, element, attrs) {
			adminServices.getAndRender( scope, element );
		}
		
		
		
		return {
			link: link
		}
	}]);