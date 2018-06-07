'use strict';

angular.module('testApp', ['ui.router']);

angular.module('testApp').config(function ($stateProvider) {

	let st = {
		name: 'mainScreen',
		url: '/main',
		template: '<p>Hello world!</p>'
	};

	$stateProvider.state(st);
});