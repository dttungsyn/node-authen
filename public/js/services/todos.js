/**
 * New node file
 */
// js/services/todos.js
angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			"delete" : function(id) {
				//return $http.delete('/api/todos/' + id);
			}
		}
	})
	
	.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {	// this is link by default
            if (scope.$last) setTimeout(function(){
                //console.log(scope);
                makeTimeTable();
                //scope.loadingTimeData = false;
            }, 5);
        };
    });