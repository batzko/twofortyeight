define(["../lib/angular"], function (ng) {
	var tfe = angular.module("twofortyeight", []);

	tfe.directive("board", function () {
		return {
			restrict: "A",
			template: "<div class='row' ng-repeat='row in grid'>" +
				"<div class='cell' ng-class='{isNew:cell.isNew, zero: cell.zero, two: cell.two, three:cell.three, four:cell.four, five:cell.five}' ng-repeat='cell in row track by $index'>{{cell.value}}</div></div>",
			controller: ["$scope", function ($scope) {

				var grid;
				grid = [
					[0, 0, 0, 0],
					[0, 0, 0, 0],
					[0, 0, 0, 0],
					[0, 0, 0, 0]
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
							cell.zero = cell.value === 0;
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
					var moved = false;
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
					}

					fillInEmpty(res, rows, cols);

					if (reverse) {
						res.reverse();
					}

					if( !isSame(res, grid) ) {
						randomize(res);
					}
					updateCellStates(res);
					return res;
				}

				function isSame( a, b ) {
					for( var i=0, len = a.length;i<len;i++) {
						for( var j=0, num=a[i].length;j<num;j++) {
							if ( a[i][j].value !== b[i][j].value) {
								return false;
							}
						}
					}
					return true;
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
					});

					fillInEmpty(res, rows, cols);
					if ( reverse ) {
						res.forEach( function(row, i, grid) {
							grid[i].reverse();
						});
					}

					if( !isSame(res, grid) ) {
						randomize(res);
					}

					updateCellStates(res);
					return res;
				}

				function fillInEmpty(grid, rows, cols) {
					for ( var r=0;r<rows;r++) {
						if ( !grid[r]) {
							grid[r] = [];
						}
						for(var c=0;c < cols;c++) {
							if ( !grid[r][c] ) {
								grid[r][c] = {value:0}
							}

							grid[r][c].collapsed = false;
							grid[r][c].isNew = false;
						}
					}
				}

				function randomize(grid) {
					var empty = [],
						rows = grid.length,
						cols = grid[0].length;
					for ( var r=0;r<rows;r++) {
						for(var c=0;c < cols;c++) {
							if ( grid[r][c].value === 0) {
								empty.push(r+";"+c);
							}
						}
					}
					var cell = empty[Math.min(empty.length-1, Math.round( Math.random()*empty.length ))];
					cell = cell.split(";");
					grid[cell[0]][cell[1]].value = 2;
					grid[cell[0]][cell[1]].isNew = true;
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

				fillInEmpty(grid, 4, 4);
				randomize(grid);
				randomize(grid);

				updateCellStates( grid );

				$scope.grid = grid;
			}]
		}
	});
});