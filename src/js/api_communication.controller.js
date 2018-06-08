let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

const loading = [
	'▓▓▓▒▒▒▒▒▒',
	'▒▓▓▓▒▒▒▒▒',
	'▒▒▓▓▓▒▒▒▒',
	'▒▒▒▓▓▓▒▒▒',
	'▒▒▒▒▓▓▓▒▒',
	'▒▒▒▒▒▓▓▓▒',
	'▒▒▒▒▒▒▓▓▓',
	'▒▒▒▒▒▓▓▓▒',
	'▒▒▒▒▓▓▓▒▒',
	'▒▒▒▓▓▓▒▒▒',
	'▒▒▓▓▓▒▒▒▒',
	'▒▓▓▓▒▒▒▒▒',
];
let loadProg = 0;

ang.controller('APIController', function APIController ($scope, $http) {
	const HOST = 'http://localhost:8083/';

	$scope.possibleGoals = [];

	$scope.loadingIcon = loading[0];

	let changeLoad = setInterval(function () {
		if (loadProg + 1 === loading.length - 1) {
			$scope.loadingIcon = loading[0];
			loadProg = 0;
		}
		else {
			$scope.loadingIcon = loading[loadProg + 1];
			loadProg++;
		}
		$scope.$apply();
	}, 100);

	$http({
		url: HOST + 'api/v1/importer/goal',
		method: "GET",
		headers: {}
	})
	.then( function (data) {
		console.log(data.data);
		$scope.possibleGoals = data.data;
	});

	/*
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
	*/
});