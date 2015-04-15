/**
 * @author fpt-dev
 */
angular.module('adminModule', []);
angular.module('adminModule')
	.controller('adminController', ['$scope', 'adminServices', function( $scope, adminServices ) {
		$scope.fixColumns = [];
		$scope.customColumns = [];
		$scope.tableData = [];
		$scope.openUserInd = 0;
		$scope.openUser = null;
		var colsChange = false;
		$scope.save = function(){
			
			//close modal
			$('#myModal').modal('hide');
			
			//save
			var userData = $scope.openUser;
			var ind = $scope.openUserInd;
			var customColumns = $scope.customColumns;
			adminServices.saveUserData( userData, customColumns, function(data){
				console.log( data );
			});
			
			//reload / update dataTable
			if ( !colsChange ){
				adminServices.datatable.row(ind).data(userData).draw();
				var tr = adminServices.datatable.row(ind).nodes().to$(); 
				tr.find("td:last-child").append( adminServices.datatable.groupIcons.clone() );
				
				//remark change
				tr.addClass('just-modified');
				setTimeout(function(){
					tr.removeClass( 'just-modified' );
				}, 200);
				
			}
			
			else {
			// if columns number change or reorder
				location.reload();
				//adminServices.destroyTable();
				//adminServices.getAndRender( $scope );
			}
			
		}
		
		$scope.removeCustomCol = function( index ){
			$scope.customColumns.splice( index, 1 );
			colsChange = true;
			
		}
		
		$scope.addCustomCol = function(){
			var newCol = prompt("Please enter your name", "Harry Potter");
			if ( newCol && $scope.fixColumns.indexOf(newCol) < 0 && $scope.customColumns.indexOf(newCol) < 0 ){
				$scope.customColumns.push( newCol );
			}
			colsChange = true;
		}
		
		$( ".sortable" ).sortable();
	    $( ".sortable" ).disableSelection();
		
		//debug
		 
	}]);