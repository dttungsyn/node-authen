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
				});
				
				columns.unshift( {data: "userid"} );
				
				var tableData = data.map( function( staff, ind ){
					//add userid, (email)
					var obj = staff.data || {};
					obj.userid = staff.local.username;
					
					for (var i = 1; i < columns.length; i ++){
						if ( !obj[ columns[i].data ] ) obj[ columns[i].data ] = "";
					}
					
					return obj;
				});
				
				//update scope
				scope.columns = columns.map( function(column, ind){
					return column.data;
				});
				scope.tableData = tableData;
				
				// take the group icons inside table element
				var groupIcons = element.find( ".group-icons" );
				
				var head = $("<thead><tr></tr></thead>").appendTo(element);
				for (var i in columns){
					var column = columns[i].data;
					head.append( $("<th></th>").text( column ) );
				}
				
				var table = element.DataTable({
					data: tableData,
					columns: columns
				});
				
				element.find("tbody tr td:last-child").append( groupIcons.clone() );
				
				element.addClass("staff-data-tbl");
				
				$('#myModal').modal();
				
				element.find("tbody tr td:last-child .fa-edit").click(function(){
					//var _userid = $(this).closest("tr").
					scope.openUserInd = _findIndByUserId( tableData, table.row( $(this).closest("tr") ).data().userid );
					
					console.log( table.row( $(this).closest("tr") ).data().userid );
					
					$('#myModal').modal('show');
					scope.$apply();
				});
			})
		}
		
		function _findIndByUserId( tableData, userid ){
			for (var i in tableData){
				if (tableData[i].userid === userid) return i;
			}
			
			return -1;
		}
		
		return {
			link: link
		}
	}]);