let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

ang.controller('PopupController', function PopupController ($scope) {

	$scope.createMessage = function () {
		$scope.popup = {
			title: '---',
			type: 'message'
		};
	};

	$scope.createSuccess = function () {
		$scope.popup = {
			title: 'Success!',
			type: 'success'
		};
	};

	$scope.createWarning = function () {
		$scope.popup = {
			title: 'Warning!',
			type: 'warn'
		};
	};

	$scope.createError = function () {
		$scope.popup = {
			title: 'Error!',
			type: 'error'
		};
	};

	$scope.popup = {
		title: '---',
		type: 'message'
	};

	$scope.popupStyle = function (feature) {
		switch ($scope.popup.type) {
			case 'message': {
				if (feature === 'head') {
					return {
						"background-color": "lightgrey",
						"color": "black"
					}
				}
				else if (feature === 'body') {
					return {
						"background-color": "white",
						"color": "black"
					}
				}
				else {
					break;
				}
			}
			case 'success': {
				if (feature === 'head') {
					return {
						"background-color": "green",
						"color": "white"
					}
				}
				else if (feature === 'body') {
					return {
						"background-color": "lightgreen",
						"color": "black"
					}
				}
				else {
					break;
				}
			}
			case 'warn': {
				if (feature === 'head') {
					return {
						"background-color": "yellow",
						"color": "black"
					}
				}
				else if (feature === 'body') {
					return {
						"background-color": "lightyellow",
						"color": "black"
					}
				}
				else {
					break;
				}
			}
			case 'error': {
				if (feature === 'head') {
					return {
						"background-color": "red",
						"color": "white"
					}
				}
				else if (feature === 'body') {
					return {
						"background-color": "salmon",
						"color": "black"
					}
				}
				else {
					break;
				}
			}
			default: {
				break;
			}
		}
	}

});