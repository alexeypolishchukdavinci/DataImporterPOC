let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

ang.controller('DataMappingController', function DataMappingController ($scope, $element) {

	$scope.currentTab = 0;

	$scope.getTabStyle = function (i) {
		return {
			"width": "calc((100% / " + $scope.tabs.length + ") - (1px * " + $scope.tabs.length + "))",
			"border": "1px solid black",
			"text-align": "center",
			"display": "inline-block",
			"background-color": (i === $scope.currentTab ? "lightgrey" : "white"),
			"cursor": "pointer",
			"font-size": "18pt"
		};
	};

	$scope.getColumnStyle = function (i) {
		return {
			"width": "calc((100% / " + $scope.tabs[$scope.currentTab].columns.length + ") - (1px * " + $scope.tabs[$scope.currentTab].columns.length + "))",
			"border": "1px solid black",
			"text-align": "center",
			"display": "inline-block",
			"background-color": (i === $scope.tabs[$scope.currentTab].currentColumn ? "lightgrey" : "white"),
			"cursor": "pointer",
			"font-size": "18pt"
		};
	};

	$scope.switchTab = function (i) {
		$scope.currentTab = i;
		$scope.switchColumn($scope.tabs[$scope.currentTab].currentColumn);
	};

	$scope.switchColumn = function (i) {
		$scope.tabs[$scope.currentTab].currentColumn = i;
		$scope.tabs[$scope.currentTab].columnPreview = getColumnPreview(i);
		//console.log($scope.currentColumn());
	};
	
	function getColumnPreview(i) {
		return [i, i*2, i*3, i*4, i, 0, i*-1, i+1, i+2, i+3];
	}

	const TEST_CHECK = [
		{value: 'check1', display: 'Option 1', select: false, type: 'check'},
		{value: 'check2', display: 'Option 2', select: false, type: 'check'},
		{value: 'check3', display: 'Option 3', select: false, type: 'check'},
		{value: '', display: 'Other (specify)', select: false, type: 'text'},
	];

	const TEST_RADIO = [
		{value: 'radio1', display: 'Option 1', type: 'select'},
		{value: 'radio2', display: 'Option 2', type: 'select'},
		{value: 'radio3', display: 'Option 3', type: 'select'},
		{value: 'radio4', display: 'Other (specify)', type: 'text', text: ''},
	];

	const TEST_TEXT = [
		{value: '', text: 'Field 1', placeholder: 'Text here...', type: 'regular'},
		{value: '', text: 'Field 2', placeholder: 'Text here...', type: 'regular'},
		{value: '', text: 'Field 3', placeholder: 'Text here...', type: 'box'},
	];

	const TEST_MAP = [
		{value: '', text: 'Field 1', placeholder: 'Text here...', type: 'regular'},
		{value: '', text: 'Field 2', placeholder: 'Text here...', type: 'regular'},
		{value: '', text: 'Field 3', placeholder: 'Text here...', type: 'box'},
	];

	$scope.meta = {
		"ignoreCase" : true,
		"ignoreWhitespace": true,
		"autoMatch": false,
		"trim": true
	};

	function createColumns(data, format) {
		//console.log(data);
		let ret = [];
		for (let i = 0; i < data[0].length; i++) {
			ret[i] = {};
			ret[i].display = "Column " + (i + 1);
			ret[i].equivalent = '___none___';
			ret[i].metaSettings = {};
			ret[i].settings = {};
			ret[i].changesMade = false;
		}
		return ret;
	}

	function setUpTabs() {
		let data = retrieveData();
		$scope.tabs = new Array(data.length);
		for (let t = 0; t < data.length; t++) {
			$scope.tabs[t] = {};
			$scope.tabs[t].index = t;
			$scope.tabs[t].name = data[t].name;
			$scope.tabs[t].currentColumn = 0;
			$scope.tabs[t].columns = createColumns(data[t].columns, data[t].columnFormat);
			$scope.tabs[t].equivalencies = getEquivalencies();
		}
		console.log($scope.tabs);
	}

	$scope.changeSettings = function () {

		let currentTab = $scope.tabs[$scope.currentTab];
		let currentColumn = currentTab.columns[currentTab.currentColumn];
		let cont = true;

		if (currentColumn.changesMade) {
			cont = confirm("You have configured settings. Are you sure you wish to change the mapping and abandon these?");
		}

		if (cont) {
			let equiv = JSON.parse(JSON.stringify(currentTab.equivalencies[currentColumn.equivalent]));
			currentColumn.settings = equiv.settings;
			currentColumn.metaSettings = equiv.metaSettings;
			currentColumn.changesMade = false;
		}
	};

	$scope.getDataType = function (eq) {
		let ret = $scope.tabs[$scope.currentTab].equivalencies[eq].type;
		return (ret === undefined ? '[UNDEFINED]' : ret);
	};

	$scope.currentColumn = function () {
		//console.log($scope.tabs[$scope.currentTab].columns);
		return $scope.tabs[$scope.currentTab].columns[$scope.tabs[$scope.currentTab].currentColumn];
	};

	function getEquivalencies() {
		return {
			"___none___": {
				equivalent: '___none___',
				display: 'Please select an equivalent column...',
				type: '[UNDEFINED]',
				mandatory: false,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {}
			},
			"ITEM_NAME": {
				equivalent: 'ITEM_NAME',
				display: 'Item Name',
				type: 'Arbitrary Word',
				mandatory: true,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"ITEM_ID": {
				equivalent: 'ITEM_ID',
				display: 'Item ID',
				type: '32 Character ID',
				mandatory: true,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"ITEM_PRICE": {
				equivalent: 'ITEM_PRICE',
				display: 'Price',
				type: 'Money - USD',
				mandatory: true,
				settings: {
					check: {enabled: false},
					text: {enabled: false},
					radio: {
						enabled: true,
						title: 'Select price format.',
						name: 'radioPrice1',
						options: [
							{value: 'radio1', display: '$$$,$$$.CC', type: 'select'},
							{value: 'radio2', display: '$$$.$$$,CC', type: 'select'},
							{value: 'radio3', display: '$$$$$$.CC', type: 'select'},
							{value: 'radio4', display: 'Other (specify)', type: 'text', text: ''},
						]
					},
					map: {enabled: false},
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"ITEM_COLOR": {
				equivalent: 'ITEM_COLOR',
				display: 'Color',
				type: 'Std. Color',
				mandatory: false,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {
						enabled: true,
						title: 'Select color format.',
						values: ['RED', 'GREEN', 'BLUE', 'YELLOW'],
						options: [
							{text: 'Field 1', key: '', value: ''},
							{text: 'Field 2', key: '', value: ''},
							{text: 'Field 3', key: '', value: ''},
						]
					}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"ITEM_MATERIAL": {
				equivalent: 'ITEM_MATERIAL',
				display: 'Material',
				type: 'Arbitrary Word',
				mandatory: false,
				settings: {
					check: {
						enabled: true,
						title: 'Select material settings.',
						options: TEST_CHECK
					},
					radio: {
						enabled: true,
						title: 'Select material settings.',
						select: 'radio1',
						name: 'radio',
						options: TEST_RADIO
					},
					text: {
						enabled: true,
						title: 'Select material settings.',
						options: TEST_TEXT
					},
					map: {
						enabled: true,
						title: 'Select material settings.',
						options: TEST_MAP
					}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"STORE_GA": {
				equivalent: 'STORE_GA',
				display: 'Store Location',
				type: 'Address',
				mandatory: true,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"PURCHASE_TIME": {
				equivalent: 'PURCHASE_TIME',
				display: 'Purchase Time',
				type: 'Address',
				mandatory: false,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"QUANTITY": {
				equivalent: 'QUANTITY',
				display: 'Quantity',
				type: 'Address',
				mandatory: true,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"ON_SALE": {
				equivalent: 'ON_SALE',
				display: 'On Sale?',
				type: 'Address',
				mandatory: false,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"SALE_DISCOUNT": {
				equivalent: 'SALE_DISCOUNT',
				display: 'Sale Discount',
				type: 'Address',
				mandatory: false,
				settings: {
					check: {enabled: false},
					radio: {enabled: false},
					text: {enabled: false},
					map: {enabled: false}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			},
			"TEST_TEST": {
				equivalent: 'TEST_TEST',
				display: 'Test Column',
				type: 'Address',
				mandatory: true,
				settings: {
					check: {
						enabled: true,
						title: 'Select settings.',
						options: TEST_CHECK
					},
					radio: {
						enabled: true,
						title: 'Select settings.',
						select: 'radio1',
						name: 'radio',
						options: TEST_RADIO
					},
					text: {
						enabled: true,
						title: 'Select settings.',
						options: TEST_TEXT
					},
					map: {
						enabled: true,
						title: 'Select settings.',
						options: TEST_MAP
					}
				},
				metaSettings: {
					ignoreCase: true,
					ignoreWhitespace: true,
					autoMatch: false,
					trim: true
				}
			}
		};
	}

	function retrieveData() {
		return [
			{
				name: "Sheet 1",
				columns: [
					['Col 1', 'Col 2', 'Col 3', 'Col 4', 'Col 5', 'Col 6', 'Col 7', 'Col 8', 'Col 9', 'Col 10']
				],
				columnFormat: {
					option: 'auto'
				},
			},
			{
				name: "Sheet 2",
				columns: [
					['Col 1', 'Col 2', 'Col 3', 'Col 4', 'Col 5', 'Col 6']
				],
				columnFormat: {
					option: 'auto'
				}
			},
			{
				name: "Sheet 3",
				columns: [
					['Col 1', 'Col 2', 'Col 3', 'Col 4']
				],
				columnFormat: {
					option: 'auto'
				}
			}
		]
	}

	setUpTabs();
	$scope.switchColumn(0);
});