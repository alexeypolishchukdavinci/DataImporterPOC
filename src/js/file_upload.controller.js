'use strict';

let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

const FILE_EXTENSIONS = {
	'SPREADSHEET-EXCEL': [
		'.xls', '.xlsx', '.xlsm', '.xlt'
	],
	'SPREADSHEET-OTHER': [
		'.csv'
	],
	'TEXT': [
		'.txt'
	],
};

const NONE_SELECTED = '___none___';

ang.controller('FileUploadController', function FileUploadController ($scope) {

	function getProfileList() {
		return [
			{
				name: "Styles Profile",
				import_type: "styles"
			},
			{
				name: "Sales Profile",
				import_type: "sales_biweekly"
			},
			{
				name: "Profile 01",
				import_type: "MULTI_SHEET"
			}
		];
	}

	function getImportGoalList() {
		return [
			{
				name: "Styles",
				import_type: "styles",
				file_types: ["SPREADSHEET-EXCEL", "SPREADSHEET-OTHER"]
			},
			{
				name: "Sales - Biweekly",
				import_type: "sales_biweekly",
				file_types: ["SPREADSHEET-EXCEL", "SPREADSHEET-OTHER"]
			}
		];
	}

	$scope.getSheetModel = function (i) {
		return $scope.sheets[i.toString()];
	};

	///// PROFILE VARIABLES /////
	$scope.listOfProfiles = getProfileList();
	$scope.selectedProfileText = NONE_SELECTED;
	$scope.selectedProfile = null;
	$scope.newProfile = false;

	///// GOAL VARIABLES /////
	$scope.listOfImportGoals = getImportGoalList();
	$scope.selectedImportGoalText = NONE_SELECTED;
	$scope.selectedImportGoal = null;

	///// FILE UPLOAD VARIABLES /////
	$scope.file = null;
	$scope.fileIsUploaded = false;
	$scope.fileName = null;
	$scope.fileType = null;

	///// FILE SETTING VARIABLES /////
	$scope.sheets = [];
	$scope.multiSheet = false;
	$scope.selectedSheets = [];
	$scope.selectedDelimiter = ',';
	$scope.enteredDelimiter = ',';
	$scope.hasHeader = false;
	$scope.numHeaderRows = 1;
	$scope.headerOption = '';
	$scope.headerOptionConcat = '';
	$scope.headerOptionNumber = 1;
	
	$scope.setSelectedProfile = function () {
		if ($scope.selectedProfileText === NONE_SELECTED) {
			$scope.newProfile = false;
		}
		else if ($scope.selectedProfileText === '___new___') {
			$scope.newProfile = true;
		}
		else {
			$scope.newProfile = false;
			for (let i = 0; i < $scope.listOfProfiles.length; i++) {
				if ($scope.listOfProfiles[i].import_type === $scope.selectedProfileText) {
					$scope.selectedProfile = $scope.listOfProfiles[i];
					break;
				}
			}
		}
	};

	$scope.setSelectedImportGoal = function (index) {
		if (index === undefined) {
			if ($scope.selectedImportGoalText === NONE_SELECTED) {
				$scope.multiSheet = false;
			}
			else if ($scope.selectedImportGoalText === '___multiple___') {
				$scope.multiSheet = true;
			}
			else {
				$scope.multiSheet = false;
				for (let i = 0; i < $scope.listOfImportGoals.length; i++) {
					if ($scope.listOfImportGoals[i].import_type === $scope.selectedImportGoalText) {
						$scope.selectedImportGoal = $scope.listOfImportGoals[i];
						break;
					}
				}
			}
		}
		else {
			//console.log($scope.sheets);
		}
	};
	
	$scope.getAcceptedFileTypes = function () {
		if ($scope.selectedImportGoal === null) return;
		let ret = '';
		for (let i = 0; i < $scope.selectedImportGoal.file_types.length; i++) {
			let str = $scope.selectedImportGoal.file_types[i];
			let arr = FILE_EXTENSIONS[str];
			for (let j = 0; j < arr.length; j++) {
				ret += arr[j] + (j === arr.length - 1 ? '' : ', ');
			}
			if (i !== $scope.selectedImportGoal.file_types.length - 1) ret += ', ';
		}
		return (ret === '' ? '*/*' : ret);
	};
	
	$scope.selectFile = function (element) {
		let file = element.files[0];
		let reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = function(e) {
			$scope.file = reader.result;
			$scope.fileIsUploaded = true;
			$scope.fileName = file.name;
			$scope.fileType = file.name.split('.');
			$scope.fileType = $scope.fileType[$scope.fileType.length - 1];

			let tableData = new Uint8Array(reader.result);
			$scope.sheets = getSheets(tableData);

			$scope.$apply();
		};
	};

	function getSheets (array) {
		let sheetNames = XLSX.read(array, {
			type: 'array',
			bookSheets: true
		}).SheetNames;

		let x = true;
		if (x) {
			let ret = [];
			for (let i = 0; i < sheetNames.length; i++) {
				ret.push({
					select: true,
					name: sheetNames[i],
					import_type: "___none___",
					isPseudo: false
				});
			}
			return ret;
		}
		else { // If non-excel file, create just one pseudo-sheet
			return [
				{
					select: true,
					name: "Sheet 1",
					import_type: "___none___",
					isPseudo: true
				}
			]
		}
	}

	const NO_TYPE_SETTINGS = {
		headers: false,
		sheets: false,
		delimiter: false
	};

	const EXCEL_TYPE_SETTINGS = {
		headers: true,
		sheets: true,
		delimiter: false
	};

	const CSV_TYPE_SETTINGS = {
		headers: true,
		sheets: false,
		delimiter: true
	};

	$scope.getValidFileSettings = function () {
		if ($scope.fileType !== null) {
			switch ($scope.fileType) {
				case 'xls': {
					return EXCEL_TYPE_SETTINGS;
				}
				case 'xlsx': {
					return EXCEL_TYPE_SETTINGS;
				}
				case 'xlsm': {
					return EXCEL_TYPE_SETTINGS;
				}
				case 'xlt': {
					return EXCEL_TYPE_SETTINGS;
				}
				case 'csv': {
					return CSV_TYPE_SETTINGS;
				}
				default: {
					return NO_TYPE_SETTINGS;
				}
			}
		}
		else {
			return null;
		}
	};

	$scope.csvDelimiters = [
		{
			display: 'Comma ,',
			value: ','
		},
		{
			display: 'Period .',
			value: '.'
		},
		{
			display: 'Semi-Colon ;',
			value: ';'
		},
		{
			display: 'Caret ^',
			value: '^'
		},
		{
			display: 'Pipe |',
			value: '|'
		},
		{
			display: 'Space',
			value: ' '
		},
		{
			display: 'Tab',
			value: '\t'
		}
	];

	$scope.allowUpload = function () {
		let n = 0;
		switch ($scope.fileType) {
			case 'xls':
			case 'xlsx':
			case 'xlsm':
			case 'xlt': {
				for (let i = 0; i < $scope.sheets.length; i++) {
					if ($scope.sheets[i].select) {
						if ($scope.sheets[i].import_type === NONE_SELECTED) {
							return false;
						}
					}
					else {
						n++;
					}
				}
				break;
			}
			case 'csv': {
				return true;
			}
			default: {
				return false;
			}
		}

		if (n === $scope.sheets.length) {
			return false;
		}
		return true;
	};

	$scope.doUpload = function () {
		let uploadedMetadata = {
			header: $scope.hasHeader,
			headerRows: $scope.numHeaderRows,
			headerOption: {
				option: $scope.headerOption,
				concat: $scope.headerOptionConcat,
				rowNum: $scope.headerOptionNumber
			},
			sheets: [],
			delimiter: ($scope.selectedDelimiter === 'OTHER' ? $scope.enteredDelimiter : $scope.selectedDelimiter)
		};

		for (let i = 0; i < $scope.sheets.length; i++) {
			if ($scope.sheets[i].select) {
				uploadedMetadata.sheets.push({
					index: i,
					goal: $scope.sheets[i].import_type
				});
			}
		}

		$scope.uploadedMetadata = uploadedMetadata;

		//uploadFile();
		//uploadMetaData(uploadedMetadata);
	};

	$scope.uploadedMetadata = {};
});