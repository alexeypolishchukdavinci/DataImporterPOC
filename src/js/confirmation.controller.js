let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

ang.controller('ConfirmationController', function ConfirmationController ($scope) {

	$scope.processIcon = '|';
	$scope.percentDone = 0;

	const toLoad = '▒';
	const loaded = '▓';
	const barLength = 10;

	$scope.addPercent = function() {
		$scope.percentDone = ($scope.percentDone + 10 > 100 ? 100 : $scope.percentDone + 10);
	};

	$scope.progBar = function () {
		let p = Math.floor($scope.percentDone / 10) / 10 * barLength;
		let ret = '';
		for (let i = 1; i <= barLength; i++) {
			if (i <= p) {
				ret += loaded;
			}
			else {
				ret += toLoad;
			}
		}
		return ret;
	};

	let loadIcon = setInterval(function () {
		switch ($scope.processIcon) {
			case '|': {
				$scope.processIcon = '/';
				break;
			}
			case '/': {
				$scope.processIcon = '―';
				break;
			}
			case '―': {
				$scope.processIcon = '\\';
				break;
			}
			case '\\': {
				$scope.processIcon = '|';
				break;
			}
		}
		$scope.$apply();
	}, 250);

	let loadStatus = null;

	$scope.status = {
		status: '___none___',
		warnings: [],
		errors: [],
		messages: []
	};

	$scope.receiveConfirmation = function (status) {
		$scope.status = status;
		//console.log($scope.status);
	};

	$scope.statusStyle = function () {
		switch ($scope.status.status) {
			case 'processing': {
				return {
					"background-color": "white",
					"color": "black"
				}
			}
			case 'success': {
				return {
					"background-color": "green",
					"color": "white"
				}
			}
			case 'warn': {
				return {
					"background-color": "yellow",
					"color": "black"
				}
			}
			case 'error': {
				return {
					"background-color": "red",
					"color": "white"
				}
			}
			default: {
				return {
					"background-color": "white",
					"color": "black"
				}
			}
		}
	};

	$scope.testProcess = function() {
		$scope.percentDone = 0;
		$scope.receiveConfirmation({
			status: 'processing',
			messages: []
		});

		loadStatus = setInterval(function () {
			if ($scope.percentDone >= 100) {
				$scope.testSuccess();
			}

			let x = Math.round(Math.random() * 10 + 1);
			if (x < 5) {
				$scope.percentDone++;
			}
			else if (x === 5) {
				$scope.status.messages.push({text: 'Finished task [...]'});
			}
			$scope.$apply();
		}, 250);
	};

	$scope.testSuccess = function() {
		clearInterval(loadStatus);
		$scope.receiveConfirmation({
			status: 'success',
		});
	};

	$scope.testWarn = function() {
		clearInterval(loadStatus);
		$scope.receiveConfirmation({
			status: 'warn',
			warnings: [
				{
					text: `Cell is empty on row 10, column 1.`,
				},
				{
					text: `Cell is empty on row 10, column 2.`,
				},
				{
					text: `Cell is empty on row 10, column 3.`,
				},
				{
					text: `Cell is empty on row 10, column 5.`,
				},
				{
					text: `Cell is empty on row 10, column 6.`,
				},
				{
					text: `Cell is empty on row 11, column 1.`,
				},
				{
					text: `Cell is empty on row 12, column 1.`,
				},
				{
					text: `Cell is empty on row 13, column 1.`,
				},
				{
					text: `Cell is empty on row 13, column 2.`,
				},
				{
					text: `Row 3 is blank. Ignoring.`,
				},
				{
					text: `Row 4 is blank. Ignoring.`,
				},
				{
					text: `Row 19 is blank. Ignoring.`,
				},
				{
					text: `Row 21 is blank. Ignoring.`,
				},
				{
					text: `Incorrect data format on row 15, column 11. Ignoring.`,
				},
				{
					text: `Incorrect data format on row 15, column 12. Ignoring.`,
				},
				{
					text: `Incorrect data format on row 16, column 11. Ignoring.`,
				}
			]
		});
	};

	$scope.testError = function() {
		clearInterval(loadStatus);
		$scope.receiveConfirmation({
			status: 'error',
			errors: [
				{
					text: `Server could not process the settings provided. Please try again later.`,
				}
			]
		});
	};
});