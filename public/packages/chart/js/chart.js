/**
 * Angular chart controller
 * parent: mainController
 */

angular.module('todoController')
	.controller('chartController', ['$scope', function($scope) {
		
		var fpttime = window.fpttime || {};
		window.fpttime = fpttime;
		
		nv.addGraph(function() {
		  var chart = nv.models.discreteBarChart()
		      .x(function(d) { return d.label ;})    //Specify the data accessors.
		      .y(function(d) { return d.value ;})
		      .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
		      .tooltips(false)        //Don't show tooltips
		      .showValues(true)       //...instead, show the bar value right on top of each bar.
		      .transitionDuration(350)
		      ;
		
		  d3.select('#mychart svg')
		      .datum(exampleData())
		      .call(chart);
		
		  nv.utils.windowResize(chart.update);
		  
		  $scope.$watch(function() { return $scope.$parent.timeDatas.data ; },
		      function() {
		      	var timedata = $scope.$parent.timeDatas.data;
		      	console.log( "Time data changed!" );
		      	
		      	//update chart
		      	setTimeout(function(){
		      		/*
					  d3.select('#mychart svg')
										.datum(exampleData())
										.call(chart);*/
					  
		      	}, 500);
		      	
		      }
		  );
		  
		  fpttime.chart = chart;
		
		  return chart;
		});
	}])
	
//Each bar represents a single discrete quantity.
function exampleData() {
 return  [ 
    {
      key: "Cumulative Return",
      values: [
        { 
          "label" : "A Label" ,
          "value" : -29.765957771107
        } , 
        { 
          "label" : "B Label" , 
          "value" : 0
        } , 
        { 
          "label" : "C Label" , 
          "value" : 32.807804682612
        } , 
        { 
          "label" : "D Label" , 
          "value" : 196.45946739256
        } , 
        { 
          "label" : "E Label" ,
          "value" : 0.19434030906893
        } , 
        { 
          "label" : "F Label" , 
          "value" : -98.079782601442
        } , 
        { 
          "label" : "G Label" , 
          "value" : -13.925743130903
        } , 
        { 
          "label" : "H Label" , 
          "value" : -5.1387322875705
        }
      ]
    }
  ];

}