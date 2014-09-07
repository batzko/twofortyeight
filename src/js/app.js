define(["../lib/angular"], function (ng) {
	var tfe = angular.module("twofortyeight", []);

	tfe.directive("board", function () {
		return {
			restrict: "A",
			template: "<div class='row' ng-repeat='row in grid'>" +
				"<div class='cell' ng-class='{two: cell.two, three:cell.three, four:cell.four, five:cell.five}' ng-repeat='cell in row track by $index'>{{cell.value}}</div></div>",
			controller: ["$scope", function ($scope) {

				var grid;
				grid = [
					[2, 0, 16, 16],
					[0, 8, 16, 16],
					[2, 0, 16, 32],
					[4, 8, 16, 64]
				];

				/*grid = [
				 [2],
				 [0],
				 [2],
				 [8]
				 ];*/

				grid.forEach(function (row, i, arr) {
					arr[i] = row.map(function (value) {
						return {
							value: value
						}
					});
				});

				function updateCellStates(grid) {
					grid.forEach(function (row, i, arr) {
						row.forEach(function (cell) {
							var s = Math.ceil(Math.log(cell.value) / Math.log(10));
							cell.two = s === 2;
							cell.three = s === 3;
							cell.four = s === 4;
							cell.five = s === 5;
							cell.six = s === 6;
						});
					});
				}

				function vertical(grid, reverse) {
					if (reverse) {
						grid.reverse();
					}
					var rows = grid.length,
						cols = grid[0].length;
					var res = [];
					var cell, next;
					var tr;
					for (var c = 0; c < cols; c++) {
						tr = 0;
						for (var r = 0; r < rows; r++, tr++) {
							if (!res[tr]) {
								res[tr] = [];
							}
							while (r < rows && !grid[r][c].value) {
								r++;
								if (r < rows && tr > 0 && !res[tr - 1][c].collapsed && res[tr - 1][c].value === grid[r][c].value) {
									res[tr - 1][c].value *= 2;
									res[tr - 1][c].collapsed = true;
									r++;
								}
							}
							next = grid[r] ? grid[r][c] : null;
							if (next && next.value) {
								if (tr > 0 && !res[tr - 1][c].collapsed && res[tr - 1][c].value === next.value) {
									res[tr - 1][c].value *= 2;
									res[tr - 1][c].collapsed = true;
									tr--;
								}
								else {
									res[tr][c] = next;
								}
							}
						}
						for (tr = 0; tr < rows; tr++) {
							if (!res[tr]) {
								res[tr] = [];
							}
							if (!res[tr][c]) {
								res[tr][c] = {value: 0};
							}
							res[tr][c].collapsed = false;
						}
					}

					if (reverse) {
						res.reverse();
					}
					//fillInEmpty(res);
					updateCellStates(res);
					return res;
				}

				function horizontal(grid, reverse) {
					var rows = grid.length,
						cols = grid[0].length;
					var res = [];
					var next;
					var tr;
					grid.forEach( function( row, r ) {
						if ( reverse ) {
							row.reverse();
						}
						var cols = row.length;
						res.push([]);
						var tc = 0;
						for (var c = 0; c < cols; c++, tc++) {
							while (c < cols && !row[c].value) {
								c++;
								if (c < rows && tc > 0 && !res[r][tc-1].collapsed && res[r][tc-1].value === grid[r][c].value) {
									res[r][tc-1].value *= 2;
									res[r][tc-1].collapsed = true;
									c++;
								}
							}
							next = row[c];
							if (next && next.value) {
								if (tc > 0 && !res[r][tc-1].collapsed && res[r][tc-1].value === next.value) {
									res[r][tc - 1].value *= 2;
									res[r][tc - 1].collapsed = true;
									tc--;
								}
								else {
									res[r][tc] = next;
								}
							}
						}

						for (tc = 0; tc < cols; tc++) {
							if (!res[r]) {
								res[r] = [];
							}
							if (!res[r][tc]) {
								res[r][tc] = {value: 0};
							}
							res[r][tc].collapsed = false;
						}

						if ( reverse ) {
							res[r].reverse();
						}
					});


					updateCellStates(res);
					return res;
				}

				function fillInEmpty(grid) {
					grid.forEach(function (row) {
						var n = row.length;
						for (var c = 0; c < n; c++) {
							if (!row[c]) {
								row[c] = {value: 0};
							}
							row[c].collapsed = false;
						}
					});
				}

				function up() {
					$scope.grid = grid = vertical(grid);
				}

				function down() {
					$scope.grid = grid = vertical(grid, true);
				}

				function right() {
					$scope.grid = grid = horizontal( grid, true );
				}

				function left() {
					$scope.grid = grid = horizontal( grid );
				}

				$scope.slide = function (event) {
					switch (event.keyCode) {
						case 38:
							up();
							break;
						case 40:
							down();
							break;
						case 39:
							right();
							break;
						case 37:
							left();
							break;
					}
				};

				updateCellStates( grid );

				$scope.grid = grid;
			}]
		}
	});
});