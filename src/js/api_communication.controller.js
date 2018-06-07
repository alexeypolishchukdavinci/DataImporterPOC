let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

ang.controller('APIController', function APIController ($scope, $http) {
	const HOST = 'http://localhost:8083/';

	$scope.received = '';
	$scope.currentAPI = '';

	$scope.people = [
		{
			"id": 0,
			"personName": "Alexey",
			"dob": 0
		}
	];

	$scope.addPerson = function () {
		$scope.people.push({
			"id": $scope.people.length,
			"personName": "",
			"dob": 0
		});
	};

	$scope.removePerson = function () {
		$scope.people.pop();
	};

	$scope.postPersonsAPI = function () {
		$scope.currentAPI = 'persons';
		$http({
			url: HOST + 'api/v1/importer/persons',
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			data: {
				"persons": $scope.people
			}
		})
		.then(function (data) {
			let dat = data.data.persons;
			let str = '';
			for (let p = 0; p < dat.length; p++) {
				str += 'ID: ' + dat[p].id + ', Name: ' + dat[p].personName + ', DoB: ' + dat[p].dob + '\n';
			}
			alert(str);
		});
	};
});