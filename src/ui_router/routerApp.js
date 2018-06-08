let ang = angular.module('routerApp', ['ui.router']);

ang.config(['$qProvider', function ($qProvider) {
	$qProvider.errorOnUnhandledRejections(false);
}]);

function getImageSrc(i, type) {
	let ret = '';
	if (i < 10) ret += '00';
	else if (i < 100) ret += '0';
	return 'src/img/' + type + ret + i + '.jpg';
}

ang.controller('AnimalController', function CatController ($scope) {
	$scope.getSrc = function (i, animal) {
		return getImageSrc(i + 1, animal);
	}
});

ang.config(
	['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state(
				'home', {
					url: '/',
					templateUrl: 'src/ui_router/html/home.html',
					controller: 'HomeController'
				}
			)
			.state(
				'cats', {
					url: '/cats/',
					templateUrl: 'src/ui_router/html/page01.html',
					controller: 'AnimalController'
				}
			)
			.state(
				'dogs', {
					url: '/dogs/',
					templateUrl: 'src/ui_router/html/page02.html',
					controller: 'AnimalController'
				}
			)
			.state(
				'rabbits', {
					url: '/rabbits/',
					templateUrl: 'src/ui_router/html/page03.html',
					controller: 'AnimalController'
				}
			)
	}]
);

ang.directive('myFooter', function() {
	return {
		templateUrl: 'src/html/footer_bar.html'
	};
});