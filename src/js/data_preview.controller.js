let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

ang.controller('DataPreviewController', function DataPreviewController ($scope) {

	$scope.table = new Handsontable(document.getElementById('hotTable'), {
			width: 750,
			height: 500,
			data: [],
			colHeaders: true,
			maxSpareRows: 0,
			readOnly: true
		}
	);

	$scope.getTabStyle = function (i) {
		return {
			"width": Math.floor(100 / $scope.tabs.length).toString() + "%",
			"border": "1px solid black",
			"text-align": "center",
			"display": "inline-block",
			"background-color": (i === $scope.currentTab ? "lightgrey" : "white"),
			"cursor": "pointer",
			"font-size": "18pt"
		};
	};

	function retrieveData() {
		return [
			{
				name: "Sheet 1",
				headers: [
					['Col 1', 'Col 2', 'Col 3', 'Col 4', 'Col 5', 'Col 6', 'Col 7', 'Col 8', 'Col 9', 'Col 10']
				],
				headerSettings: {
					option: 'auto'
				},
				totalRows: 50,
			},
			{
				name: "Sheet 2",
				headers: [
					['Col 1', 'Col 2', 'Col 3', 'Col 4', 'Col 5', 'Col 6', 'Col 7', 'Col 8', 'Col 9', 'Col 10'],
					['Col 11', 'Col 12', 'Col 13', 'Col 14', 'Col 15', 'Col 16', 'Col 17', 'Col 18', 'Col 19', 'Col 20']
				],
				headerSettings: {
					option: 'concat',
					concat: ','
				},
				totalRows: 1000,
			},
			{
				name: "Sheet 3",
				headers: [
					['Col 1', 'Col 2', 'Col 3', 'Col 4', 'Col 5', 'Col 6', 'Col 7', 'Col 8', 'Col 9', 'Col 10'],
					['Col 11', 'Col 12', 'Col 13', 'Col 14', 'Col 15', 'Col 16', 'Col 17', 'Col 18', 'Col 19', 'Col 20'],
				],
				headerSettings: {
					option: 'specific',
					rowNum: 1
				},
				totalRows: 100,
			}
		]
	}

	function formatHeader(data, settings) {
		let ret = [];
		switch (settings.option) {
			case 'auto': {
				for (let i = 0; i < data[0].length; i++) {
					ret[i] = "Column " + (i + 1);
				}
				return ret;
			}
			case 'all': {
				for (let i = 0; i < data.length; i++) {
					for (let j = 0; j < data[i].length; i++) {
						ret[j] = (data[i])[j] + '\n';
					}
				}
				return ret;
			}
			case 'concat': {
				for (let i = 0; i < data.length; i++) {
					for (let j = 0; j < data[i].length; j++) {
						if (ret[j] === undefined) ret[j] = '';
						ret[j] += (data[i])[j] + (j === (data[i].length - 1) ? '' : settings.concat + ' ');
					}
				}
				return ret;
			}
			case 'specific': {
				for (let i = 0; i < data[settings.rowNum].length; i++) {
					ret[i] = (data[settings.rowNum])[i];
				}
				return ret;
			}
			default: {
				return formatHeader(data, {
					option: 'specific',
					rowNum: 0
				});
			}
		}
	}

	function makeText() {
		let text = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	function requestRowPreview(sheet, start, end) {
		//console.log(start, end);
		//if (end === undefined || start === undefined) start = 0; end = $scope.tabs[$scope.currentTab].rowsPerPage;

		let tempRows = [];
		for (let i = 0; i < end - start; i++) {
			tempRows[i] = [
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + ''),
				sheet * 10 + (start + i + '')
			];
		}

		return tempRows;
	}

	function setUpTabs() {
		let data = retrieveData();
		$scope.tabs = new Array(data.length);
		for (let t = 0; t < data.length; t++) {
			$scope.tabs[t] = {};
			$scope.tabs[t].index = t;
			$scope.tabs[t].name = data[t].name;
			$scope.tabs[t].currentTab = [];
			$scope.tabs[t].currentPage = 0;
			$scope.tabs[t].rowsPerPage = 20;
			$scope.tabs[t].totalRows = data[t].totalRows;
			let head = formatHeader(data[t].headers, data[t].headerSettings);

			$scope.tabs[t].hiddenColumns = [];
			$scope.tabs[t].headers = [];
			for (let i = 0; i < head.length; i++) {
				$scope.tabs[t].headers[i] = {
					index: i,
					display: head[i],
					select: true
				};
			}
		}
	}

	$scope.selectColumn = function (col) {
		if (!col.select) {
			$scope.tabs[$scope.currentTab].hiddenColumns.push(col.index);
		}
		else {
			$scope.tabs[$scope.currentTab].hiddenColumns.splice($scope.tabs[$scope.currentTab].hiddenColumns.indexOf(col.index), 1);
		}
		$scope.table.updateSettings({
			hiddenColumns: {
				columns: $scope.tabs[$scope.currentTab].hiddenColumns,
				indicators: false
			}
		});
	};

	$scope.updatePage = function (start, end) {
		$scope.tabs[$scope.currentTab].content = requestRowPreview($scope.currentTab, start, end);
		$scope.table.updateSettings({
			data: $scope.tabs[$scope.currentTab].content,
		});
	};

	$scope.refreshPage = function () {
		$scope.tabs[$scope.currentTab].currentPage = 0;
		let start = 0;
		let end = $scope.tabs[$scope.currentTab].rowsPerPage - 1;
		$scope.updatePage(start, end);
	};

	$scope.switchTab = function (i) {
		$scope.currentTab = i;
		let head = [];
		for (let i = 0; i < $scope.tabs[$scope.currentTab].headers.length; i++) {
			head[i] = $scope.tabs[$scope.currentTab].headers[i].display;
		}
		$scope.table.updateSettings({
			data: requestRowPreview(i),
			colHeaders: head
		});
		$scope.refreshPage();
	};

	setUpTabs();
	$scope.switchTab(0);
	
	$scope.nextPage = function () {
		let currPage = $scope.tabs[$scope.currentTab].currentPage;
		let perPage = $scope.tabs[$scope.currentTab].rowsPerPage;
		let max = $scope.tabs[$scope.currentTab].totalRows;
		let start = perPage * currPage;
		let end = perPage * (currPage + 1) - 1;

		if (start + perPage < max) {
			start += perPage;
		}
		else {
			return;
		}

		if (end + perPage >= max) {
			end = max - 1;
		}
		else {
			end += perPage;
		}

		$scope.updatePage(start, end);
		$scope.tabs[$scope.currentTab].currentPage++;
	};
	
	$scope.prevPage = function () {
		let currPage = $scope.tabs[$scope.currentTab].currentPage;
		let perPage = $scope.tabs[$scope.currentTab].rowsPerPage;
		let start = perPage * currPage;
		let end = perPage * (currPage + 1) - 1;

		if (start - perPage > -1) {
			start -= perPage;
		}
		else {
			return;
		}

		if (end - perPage < 0) {
			end = 0;
		}
		else {
			end -= perPage;
		}

		$scope.updatePage(start, end);
		$scope.tabs[$scope.currentTab].currentPage--;
	};
});