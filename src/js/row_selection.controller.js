let ang = angular.module('testApp', []);

ang.directive('myFooter', function() {
	return {
		templateUrl: '../html/footer_bar.html'
	};
});

function createError(code, vars) {
	switch (code){
		case 'ZERO_STRING_LENGTH': {
			return 'You have not entered something to parse.';
		}
		case 'NOT_AN_INTEGER': {
			return `'${vars.str}' is not an integer.`;
		}
		case 'SAME_NUMBERS': {
			return `'${vars.num}-${vars.num}' can be simplified down to just '${vars.num}'.`;
		}
		case 'WRONG_DASHES': {
			return `'${vars.str}' has incorrectly many dashes. Ranges are to be separated by a single '-'.`;
		}
		case 'NUM_IS_NAN': {
			return `'${vars.num}' is not a valid integer.`;
		}
		case 'NUM_TOO_LARGE': {
			return `'${vars.num}' is larger than the number of available rows.`;
		}
		case 'NUM_IS_ZERO': {
			return `Row indexing begins at 1.`;
		}
		case 'BAD_NUMBER_ORDER': {
			return `The number right of a dash must be greater than or equal to the left number. Consider swapping '${vars.start}' and '${vars.end}'.`;
		}
		case 'EVERY_NEGATIVE': {
			return `Number after 'every' shortcut must be greater than zero.`;
		}
		case 'EVERY_NAN': {
			return `Could not parse the number after 'every' shortcut.`;
		}
		case 'UNKNOWN_VALUE': {
			return `The value '${vars.str}' is neither a valid range nor shortcut.`;
		}
		case 'BAD_SHORTCUT_PARAMS': {
			return ``;
		}
	}
}

function validNumber(x, ret, rowCount) {
	let valid = true;

	if (!x.match('^[0-9]+$')) {
		ret.errs.push({
			text: createError('NOT_AN_INTEGER', {
				str: x,
			}),
			level: 1
		});
		return {
			x: x,
			ret: ret,
			valid: false
		};
	}

	let y = parseInt(x);

	if (y === 0) {
		ret.errs.push({
			text: createError('NUM_IS_ZERO', {
				num: y,
			}),
			level: 1
		});
		valid = false;
	}
	if (y > rowCount) {
		ret.errs.push({
			text: createError('NUM_TOO_LARGE', {
				num: y
			}),
			level: 1
		});
		valid = false;
	}

	return {
		x: x,
		ret: ret,
		valid: valid,
		rng: [y, y]
	};
}

function validNumberRange(x, ret, rowCount) {

	let valid = true;
	x = x.split('-');

	if (!x[0].match('^[0-9]+$')) {
		ret.errs.push({
			text: createError('NOT_AN_INTEGER', {
				str: x[0],
			}),
			level: 1
		});
		valid = false;
	}
	if (!x[1].match('^[0-9]+$')) {
		ret.errs.push({
			text: createError('NOT_AN_INTEGER', {
				str: x[1],
			}),
			level: 1
		});
		valid = false;
	}

	if (!valid) {
		return {
			x: x,
			ret: ret,
			valid: valid
		};
	}

	let y = new Array(2);
	y[0] = parseInt(x[0]);
	y[1] = parseInt(x[1]);
	if (isNaN(y[0])) {
		ret.errs.push({
			text: createError('NUM_IS_NAN', {
				num: x[0],
			}),
			level: 1
		});
		valid = false;
	}
	if (isNaN(y[1])) {
		ret.errs.push({
			text: createError('NUM_IS_NAN', {
				num: x[1],
			}),
			level: 1
		});
		valid = false;
	}
	if (y[0] === 0) {
		ret.errs.push({
			text: createError('NUM_IS_ZERO', {
				num: y[0],
			}),
			level: 1
		});
		valid = false;
	}
	if (y[1] === 0) {
		ret.errs.push({
			text: createError('NUM_IS_ZERO', {
				num: y[1],
			}),
			level: 1
		});
		valid = false;
	}
	if (y[0] > y[1]) {
		ret.errs.push({
			text: createError('BAD_NUMBER_ORDER', {
				start: y[0],
				end: y[1]
			}),
			level: 1
		});
		valid = false;
	}
	if (y[0] > rowCount) {
		ret.errs.push({
			text: createError('NUM_TOO_LARGE', {
				num: y[0]
			}),
			level: 1
		});
		valid = false;
	}
	if (y[1] > rowCount) {
		ret.errs.push({
			text: createError('NUM_TOO_LARGE', {
				num: y[1]
			}),
			level: 1
		});
		y[1] = rowCount;
	}
	if (y[0] === y[1]) {
		ret.errs.push({
			text: createError('SAME_NUMBERS', {
				num: x[0],
			}),
			level: 0
		});
		valid = true;
	}

	return {
		x: x,
		ret: ret,
		valid: valid,
		rng: y
	};
}

function parseRowSelectionString(str, rowCount) {

	let ret = {
		selected: [], // A boolean-valued array of all selected rows
		errs: [] // A list of warnings/errors
	};
	let shortcutTable = { // Tells final logic which shortcuts were applied (and how)
		all: false,
		even: false,
		odd: false,
		every: []
	};
	let neighborTable = new Array(rowCount);
	let notTable = new Array(rowCount);
	for (let i = 0; i < rowCount; i++) {
		neighborTable[i] = false;
		notTable[i] = false;
	}
	let groupings = [];

	if (str === undefined || str === null || str.replace(/\s/g,'').length === 0) {
		ret.errs.push({
			text: createError('ZERO_STRING_LENGTH', {}),
			level: 2
		});
		ret.text = '';
		return ret;
	}

	str = str.replace(/\s/g,'').toLowerCase(); // Remove all whitespaces and lower-cases the string (for consistency)
	str = str.split(','); // All values should be comma delimited

	for (let i = 0; i < str.length; i++) {

		if (str[i] === undefined || str[i] === null || str[i].length === 0) continue;

		let x = str[i];

		if (x === 'all') {
			shortcutTable.all = true;
		}
		else if (x === 'even') {
			shortcutTable.even = true;
		}
		else if (x === 'odd') {
			shortcutTable.odd = true;
		}
		else if (x.startsWith('every')) {
			x = x.replace('every', '');
			if (!isNaN(parseInt(x))) {
				let temp = validNumber(x, ret, rowCount);
				x = temp.x;
				ret = temp.ret;

				if (temp.valid) {
					shortcutTable.every.push(parseInt(x));
				}
			}
			else {
				ret.errs.push({
					text: createError('UNKNOWN_VALUE', {
						str: x,
					}),
					level: 1
				});
			}
		}
		else if (x.startsWith('not')) {
			x = x.replace('not', '').split('-');
			if (x.length === 2) {
				let temp = validNumberRange(x[0] + '-' + x[1], ret, rowCount);
				x = temp.x;
				ret = temp.ret;

				if (temp.valid) {
					groupings.push({
						start: temp.rng[0],
						end: temp.rng[1],
						not: true
					});
				}
			}
			else if (x.length === 1) {
				x = x[0];
				if (isNaN(parseInt(x))) {
					ret.errs.push({
						text: createError('UNKNOWN_VALUE', {
							str: x,
						}),
						level: 1
					});
				}
				let temp = validNumber(x, ret, rowCount);
				x = temp.x;
				ret = temp.ret;

				if (temp.valid) {
					groupings.push({
						start: temp.rng[0],
						end: temp.rng[1],
						not: true
					});
				}
			}
			else {
				ret.errs.push({
					text: createError('WRONG_DASHES', {
						str: x
					}),
					level: 1
				});
			}
		}
		else if (x.split('-').length === 2) {
			let temp = validNumberRange(x, ret, rowCount);
			x = temp.x;
			ret = temp.ret;

			if (temp.valid) {
				groupings.push({
					start: temp.rng[0],
					end: temp.rng[1],
					not: false
				});
			}
		}
		else if (x.split('-').length > 1) {
			ret.errs.push({
				text: createError('WRONG_DASHES', {
					str: x
				}),
				level: 1
			});
		}
		else if (!isNaN(parseInt(x))) {
			let temp = validNumber(x, ret, rowCount);
			x = temp.x;
			ret = temp.ret;

			if (temp.valid) {
				groupings.push({
					start: temp.rng[0],
					end: temp.rng[1],
					not: false
				});
			}
		}
		else {
			ret.errs.push({
				text: createError('UNKNOWN_VALUE', {
					str: x,
				}),
				level: 1
			});
		}
	}

	if (shortcutTable.all) {
		for (let j = 0; j < rowCount; j++) {
			neighborTable[j] = true;
		}
	}
	if (shortcutTable.even) {
		for (let j = 1; j < rowCount; j += 2) {
			neighborTable[j] = true;
		}
	}
	if (shortcutTable.odd) {
		for (let j = 0; j < rowCount; j += 2) {
			neighborTable[j] = true;
		}
	}
	for (let i = 0; i < shortcutTable.every.length; i++) {
		for (let j = 0; j < rowCount; j += shortcutTable.every[i]) {
			neighborTable[j] = true;
		}
	}
	for (let i = 0; i < groupings.length; i++) {
		for (let j = groupings[i].start - 1; j < groupings[i].end; j++) {
			neighborTable[j] = !groupings[i].not;
		}
	}

	ret.selected = neighborTable;
	ret.n = neighborTable;

	return ret;
}

function generateEfficientString(neighborTable) {
	let n = new Array(neighborTable.length);
	for (let i = 0; i < neighborTable.length; i++) {
		n[i] = neighborTable[i];
	}
	let str = '';
	let start = -1;

	n[-1] = false;
	n[n.length] = false;

	for (let i = 0; i <= n.length; i++) {
		if (n[i] && !n[i-1]) {
			start = i;
		}
		else if (!n[i] && n[i-1]) {
			if (i === start + 1) {
				str += i + ',';
			}
			else {
				str += (start + 1) + '-' + i + ',';
			}
		}
	}

	if (str.charAt(str.length-1) === ',') {
		str = str.substr(0, str.length - 1);
	}

	return str;
}

//const HOST = 'localhost:8083/';

const b64chars = [
	'A', 'B', 'C', 'D', 'E', 'F',
	'G', 'H', 'I', 'J', 'K', 'L',
	'M', 'N', 'O', 'P', 'Q', 'R',
	'S', 'T', 'U', 'V', 'W', 'X',
	'Y', 'Z', 'a', 'b', 'c', 'd',
	'e', 'f', 'g', 'h', 'i', 'j',
	'k', 'l', 'm', 'n', 'o', 'p',
	'q', 'r', 's', 't', 'u', 'v',
	'w', 'x', 'y', 'z', '0', '1',
	'2', '3', '4', '5', '6', '7',
	'8', '9', '+', '/'
];

function charArrtoStr(arr) {
	let ret = '';
	for (let i = 0; i < arr.length; i++) {
		ret += arr[i];
	}
	return ret;
}

function base2StrToBoolArray(str) {
	let ret = [];
	for (let i = 0; i < str.length; i++) {
		ret[i] = str[i] === '1';
	}
	return ret;
}

function base2to64(str) {
	let ret = '';
	str = str.replace(/\s/g,''); // Remove all whitespace
	let n = (str.length % 6 === 0 ? 0 : 6 - (str.length % 6)); // Make sure length is a multiple of 6
	for (let i = 0; i < n; i++) str = '0' + str;
	let arr = [];
	for (let i = 0; i < str.length / 6; i++) {
		arr[i] = '';
		for (let j = 0; j < 6; j++) {
			arr[i] += str[6*i + j];
		}
		arr[i] = parseInt(arr[i], 2); // Parse integer in radix 2
		ret += b64chars[arr[i]];
	}
	return ret;
}

function base64to2(str) {
	let ret = '';
	str = str.replace(/\s/g,''); // Remove all whitespace
	let arr = [];
	for (let i = 0; i < str.length; i++) {
		arr[i] = b64chars.indexOf(str.charAt(i));
		arr[i] = arr[i].toString(2);
		let n = (arr[i].length % 6 === 0 ? 0 : 6 - (arr[i].length % 6)); // Make sure length is 6
		for (let k = 0; k < n; k++) arr[i] = '0' + arr[i];
		ret += arr[i];
	}
	return ret;
}

ang.controller('RowSelectionController', function RowSelectionController ($scope, $http) {
	$scope.parsedErrors = [];
	$scope.parsedNeighborTable = [];
	$scope.rowCount = 25;
	$scope.rowStr = '';

	console.log(base2to64('1 100010 011001 111011 110001 001000'));
	console.log(base64to2('BiZ7xI'));

	/*
	$http({
		method: 'GET',
		url: HOST + 'sum?num1=4&num2=3'
	}).then(function successCallback(response) {
		console.log(response);
	}, function errorCallback(response) {
		console.log(response);
	});
	*/

	$scope.doParse = function (str) {
		let x = parseRowSelectionString(str, Math.abs(Math.floor($scope.rowCount)));
		$scope.parsedErrors = x.errs;
		$scope.parsedNeighborTable = x.n;
	};

	$scope.makeEfficient = function() {
		$scope.rowStr = generateEfficientString($scope.parsedNeighborTable);
	};

	$scope.clickSelect = function(i) {
		$scope.parsedNeighborTable[i] = !$scope.parsedNeighborTable[i];
		$scope.makeEfficient();
	};

	$scope.addToRowStr = function(str) {
		$scope.rowStr += ',' + str;
		$scope.doParse($scope.rowStr);
	};

	$scope.getErrString = function (err) {
		let r = '';
		switch (err.level) {
			case 0: {
				r = 'SUGGESTION: ';
				break;
			}
			case 1: {
				r = 'WARNING: ';
				break;
			}
			case 2: {
				r = 'ERROR: ';
				break;
			}
			default: {
				r = '';
			}
		}
		return r + err.text;
	};

	$scope.getErrStyle = function (err) {
		let s = {
			color: 'black'
		};
		switch (err.level) {
			case 0: {
				s.color = 'grey';
				break;
			}
			case 1: {
				s.color = 'orange';
				break;
			}
			case 2: {
				s.color = 'red';
				break;
			}
			default: {
				s.color = 'black';
			}
		}
		return s;
	};

	$scope.getCellColor = function (cell) {
		return {
			'background-color': (cell == true ? 'lightgreen' : 'salmon')
		};
	}
});