/**
 * @author fpt-dev
 */
angular.module('adminModule')
	.factory('adminServices', ['$http', function($http) {
		return {
			getAllStaffInfo: function(){
				
			},
			
			saveUserData: function( userdata, customColumns, cb ){
				$http.post('/api/updateuserdata', {
					userData: userdata,
					customColumns: customColumns
				}).success(function(data){
					cb( data );
				});
			}
		};
	}]);