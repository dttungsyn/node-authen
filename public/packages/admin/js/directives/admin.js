/**
 * @author fpt-dev
 */
angular.module('adminModule')

	.directive('staffDataTable', ['$timeout', '$http', function($timeout, $http) {
		
		console.log('directive run');
		
		function link(scope, element, attrs) {
			
			$http.get('/api/staffuserdata').success(function(data){
				
				if (!data || data.length === 0){
					console.log( 'err' );
					return;
				}
				
				var columns = data[0].data_fields.map(function(field, ind){
					return {data: field};
				})
				
				columns.unshift( {data: "userid"} );
				
				var tableData = data.map( function( staff, ind ){
					//add userid
					var obj = staff.data || {};
					obj.userid = staff.local.username;
					
					for (var i = 1; i < columns.length; i ++){
						if ( !obj[ columns[i].data ] ) obj[ columns[i].data ] = "";
					}
					
					return obj;
				});
				
				element.DataTable({
					data: tableData,
					columns: columns
				});
				
			})
		}
		
		return {
			link: link
		}
	}]);