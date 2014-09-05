define(["../lib/angular"], function( ng ) {
	var tfe = angular.module("twofortyeight", []);

	tfe.directive("board", function() {
		return {
			restrict: "A",
			template: "<div class='row' ng-repeat='row in grid'>" +
				"<div class='cell' ng-class='{two: cell.two, three:cell.three, four:cell.four, five:cell.five}' ng-repeat='cell in row track by $index'>{{cell.value}}</div></div>",
			controller: ["$scope", function($scope) {
				$scope.grid = [
					[4, 2, 2, 32],
					[4, 8, 16, 512],
					[2048, 8, 16, 1024],
					[1684, 16384, 64, 4096]
				];

				$scope.grid.forEach( function( row, i, arr ) {
					arr[i] = row.map( function(value) {
						var s = Math.ceil(Math.log(value)/Math.log(10));
						return {
							value: value,
							two: s === 2,
							three: s === 3,
							four: s === 4,
							five: s === 5,
							six: s === 6
						}
					});
				});

				console.log($scope.grid);
			}]
		}
	});
});