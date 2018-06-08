ang.controller('HomeController', function HomeController ($scope, $http) {
	$scope.routedPages = [
		{
			title: 'Cats',
			url: 'cats',
			emoji: '🐱'
		},
		{
			title: 'Dogs',
			url: 'dogs',
			emoji: '🐶'
		},
		{
			title: 'Rabbits',
			url: 'rabbits',
			emoji: '🐰'
		}
	];
});