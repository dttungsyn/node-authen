/**
 * @author fpt-dev
 */
angular.module('adminModule')
	.factory('adminServices', ['$http', function($http) {
		
		function _findIndByUserId( tableData, userid ){
			for (var i in tableData){
				if (tableData[i].userid === userid) return i;
			}
			
			return -1;
		}
		
		return {
			datatable: null,
			
			element: null,
			
			getAllStaffInfo: function(){
				
			},
			
			saveUserData: function( userdata, customColumns, cb ){
				$http.post('/api/updateuserdata', {
					userData: userdata,
					customColumns: customColumns
				}).success(function(data){
					cb( data );
				});
			},
			
			getAndRender: function(scope, element){
				
				element = element || this.element;
				this.element = element;
				
				if ( !element ) element 

				var adminServices = this;
				
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
						//add _id, userid, (email)
						var obj = staff.data || {};
						obj._id = staff._id;
						obj.userid = staff.local.username;
						obj.email  = staff.local.email;
						
						
						for (var i = 1; i < columns.length; i ++){
							if ( !obj[ columns[i].data ] ) obj[ columns[i].data ] = "";
						}
						
						return obj;
					});
					
					
					// take the group icons inside table element
					var groupIcons = element.find( ".group-icons:first" ).detach();
					
					//create header element 
					element.html("");
					var head = $("<thead><tr></tr></thead>").appendTo(element);
					for (var i in columns){
						var column = columns[i].data;
						head.append( $("<th></th>").text( column ) );
					}
					
					//make DataTable
					var table = element.DataTable({
						data: tableData,
						columns: columns,
						paging: false,
						columnDefs: [ {
				            "targets": -1,
				            "data": null,
				            "defaultContent": "xx"
				        } ]
					});
					table.groupIcons = groupIcons;
					
					//debug
					window.tableda = table;
					
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
					element.find("tbody tr td:last-child").unbind();
					element.find("tbody tr td:last-child").click(function(e){
						if ($(e.target).hasClass('fa-remove')){
							adminServices.removeStaff( table.row( $(this).closest("tr") ).data().userid );
							
							return;
						}
						if ( !$(e.target).hasClass('fa-edit') ) return;
						//var _userid = $(this).closest("tr").
						scope.openUserInd = _findIndByUserId( tableData, table.row( $(this).closest("tr") ).data().userid );
						scope.openUser = table.row( $(this).closest("tr") ).data();
						
						console.log( table.row( $(this).closest("tr") ).data() );
						
						$('#myModal').modal('show');
						scope.$apply();
					});
				})
			
			},
			
			destroyTable: function(){
				if (this.datatable){
					this.element = this.element.replaceWith( "<table class='display'></table>" );
					this.datatable.destroy(true);
				}
				
			},
			
			addStaff: function(staff_username){
				$http.post('/admin/addStaff', {'staff_username': staff_username}).success(function(data){
					console.log(data);
					location.reload();
				});
			},
			
			removeStaff: function(staff_username){
				return $http.post('/admin/removeStaff', {'staff_username': staff_username}).success(function(data){
					console.log(data);
					location.reload();
				});
			},
		};
	}]);