/**
 * @author fpt-dev
 */
angular.module('adminModule')

	.directive('staffDataTable', ['$timeout', '$http', 'adminServices', function($timeout, $http, adminServices) {
		
		console.log('directive run');
		
		function link(scope, element, attrs) {
			
			$http.get('/api/staffuserdata').success(function(data){
				
				if (!data || data.length === 0){
					console.log( 'err' );
					return;
				}
				
				console.log( data );
				
				var columns = data[0].data_fields.map(function(field, ind){
					return {data: field};
				});
				
				columns.unshift( {data: "userid"}, {data: "email"} );
				
				//update scope
				scope.fixColumns = ['userid', 'email'];
				scope.customColumns = data[0].data_fields || [];
				scope.tableData = tableData;
				
				//add fix data to custom data
				var tableData = data.map( function( staff, ind ){
					//add userid, (email)
					var obj = staff.data || {};
					obj.userid = staff.local.username;
					obj.email  = staff.local.email;
					
					for (var i = 1; i < columns.length; i ++){
						if ( !obj[ columns[i].data ] ) obj[ columns[i].data ] = "";
					}
					
					return obj;
				});
				
				
				// take the group icons inside table element
				var groupIcons = element.find( ".group-icons" ).detach();
				
				//create header element 
				var head = $("<thead><tr></tr></thead>").appendTo(element);
				for (var i in columns){
					var column = columns[i].data;
					head.append( $("<th></th>").text( column ) );
				}
				
				//make DataTable
				var table = element.DataTable({
					data: tableData,
					columns: columns
				});
				
				// save to service
				adminServices.datatable = table;
				
				// add group icons to each line
				element.find("tbody tr td:last-child").append( groupIcons.clone() );
				
				// add class for table
				element.addClass("staff-data-tbl");
				
				// create modal to edit
				$('#myModal').modal({
					show: false
				});
				
				// handle icon click
				element.find("tbody tr td:last-child .fa-edit").click(function(){
					//var _userid = $(this).closest("tr").
					scope.openUserInd = _findIndByUserId( tableData, table.row( $(this).closest("tr") ).data().userid );
					scope.openUser = table.row( $(this).closest("tr") ).data();
					
					console.log( table.row( $(this).closest("tr") ).data() );
					
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