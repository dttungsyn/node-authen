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
			var ind = $scope.openUserInd;
			var customColumns = $scope.customColumns;
			adminServices.saveUserData( userData, customColumns, function(data){
				console.log( data );
			});
			
			//reload / update dataTable
			adminServices.datatable.row(ind).data(userData).draw();
			var tr = adminServices.datatable.row(ind).nodes().to$(); 
			tr.find("td:last-child").append( adminServices.datatable.groupIcons.clone() );
			
			//remark change
			tr.addClass('just-modified');
			setTimeout(function(){
				tr.removeClass( 'just-modified' );
			}, 200);
		}
		
		$scope.removeCustomCol = function( index ){
			$scope.customColumns.splice( index, 1 );
		}
		
		$scope.addCustomCol = function(){
			var newCol = prompt("Please enter your name", "Harry Potter");
			if ( newCol && $scope.fixColumns.indexOf(newCol) < 0 && $scope.customColumns.indexOf(newCol) < 0 ){
				$scope.customColumns.push( newCol );
			}
		}
		
		$( ".sortable" ).sortable();
	    $( ".sortable" ).disableSelection();
		
		//debug
		 
	}]);