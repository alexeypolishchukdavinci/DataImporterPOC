let ang = angular.module('testApp', []);

ang.factory('DataPass', function() {

	let uploadedFile = {
		file: null,
		meta: null
	};

	let fileUpload = function (file, meta) {
		uploadedFile.file = file;
		uploadedFile.meta = meta;
	}
});