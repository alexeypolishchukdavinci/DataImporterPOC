'use strict';

let testApp = angular.module('testApp', ['ngSanitize']);

function toByteName (size) {
    if (size < 1024) {
        return (Math.round(size * 100) / 100) + " B";
    }
    else if (size >= 1024 && size < 1048576) {
        return (Math.round((size / 1024) * 100) / 100) + " KB";
    }
    else if (size >= 1048576 && size < 1073741824) {
        return (Math.round((size / 1048576) * 100) / 100) + " MB";
    }
    else {
        return "too big";
    }
}

const file_type_names = {
    "image/gif": "Graphics Interchange Format (GIF)",
    "image/png": "Portable Network Graphics (PNG)",
    "image/jpeg": "JPEG images",
    "text/csv": "Comma-separated values (CSV)",
    "application/vnd.ms-excel": "Microsoft Excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Microsoft Excel Worksheet",
    "application/vnd.ms-excel.sheet.macroEnabled.12": "Microsoft Excel Macro-Enabled Worksheet",
    "application/xml": "XML"
};
let fileMap = new Map();
for (let k of Object.keys(file_type_names)) {
    fileMap.set(k, file_type_names[k]);
}

function testCellRenderer(instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = value;
    return td;
}

function mapCellRenderer(instance, td, row, col, prop, value, cellProperties) {
	if (value.toString().trim() === '') {
		td.innerHTML = '';
	}
	else {
		td.innerHTML = "<a href='" + maps + value + "'>" + value + "</a>";
	}
    return td;
}

function excelDateFormatRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value.toString().trim() === '') {
        td.innerHTML = '';
    }
    else {
        let date = serialToDMY(value);
        if (date === null) {
            td.innerHTML = "---";
        }
        else {
            td.innerHTML = dateObjectStringifier(date);
        }
    }
    return td;
}

function textRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value.toString().trim() === '') {
        td.innerHTML = '';
    }
    else {
        td.innerHTML = value.toString();
    }
    return td;
}

function numberRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value.toString().trim() === '') {
        td.innerHTML = '';
    }
    else {
        let x = parseFloat(value);
        td.innerHTML = (isNaN(x) ? '---' : x);
    }
    return td;
}

function moneyFormat(val, cur) {
    let x = Math.round(parseFloat(val) * 100) / 100;
    if (cur === undefined || cur === null || typeof(cur) !== 'string') {
        cur = '$';
    }

    if (isNaN(x)) {
        return '---'
    }
    else if (x < 0) {
        return '-' + cur + Math.abs(x);
    }
    else {
        return cur + x;
    }
}

function currencyRenderer(instance, td, row, col, prop, value, cellProperties) {
    if (value.toString().trim() === '') {
        td.innerHTML = '';
    }
    else {
        td.innerHTML = moneyFormat(value, '$');
    }
    return td;
}

function percentRenderer(instance, td, row, col, prop, value, cellProperties) {
	if (value.toString().trim() === '') {
		td.innerHTML = '';
	}
	else {
		let x = parseFloat(value);
		td.innerHTML = (isNaN(x) ? '---' : (x * 100).toString() + '%');
	}
	return td;
}

function colorRenderer(instance, td, row, col, prop, value, cellProperties) {
	if (value.toString().trim() === '') {
		td.innerHTML = '';
	}
	else {
		td.innerHTML = '<a style="color:' + value + '">' + value + '</a>';
	}
	return td;
}

function fractionRenderer(instance, td, row, col, prop, value, cellProperties) {
	if (value.toString().trim() === '') {
		td.innerHTML = '';
	}
	else {
		let x = parseFloat(value);
		td.innerHTML = (isNaN(x) ? '---' : fractionStr(x));
	}
	return td;
}
/*
function fractionStr(x) {
	let a = (x.toString()).split("\\.").length;
	let den = Math.pow(10, a);
	let num = (x * den);
	let g = gcd(num, den);
	return "" + num / g + "/" + den / g;
}

let gcd = function(a, b) {
	return (b === 0 ? a : gcd(b, a % b));
};
*/
Handsontable.renderers.registerRenderer('test_renderer', testCellRenderer);
Handsontable.renderers.registerRenderer('column_map_renderer', mapCellRenderer);
Handsontable.renderers.registerRenderer('column_date_renderer', excelDateFormatRenderer);
Handsontable.renderers.registerRenderer('column_text_renderer', textRenderer);
Handsontable.renderers.registerRenderer('column_number_renderer', numberRenderer);
Handsontable.renderers.registerRenderer('column_currency_renderer', currencyRenderer);
Handsontable.renderers.registerRenderer('column_fraction_renderer', fractionRenderer);
Handsontable.renderers.registerRenderer('column_percent_renderer', percentRenderer);
Handsontable.renderers.registerRenderer('column_color_renderer', colorRenderer);

let hot = [];
let hot2 = null;
const maps = "https://www.google.ca/maps/place/";

let container2 = document.getElementById('test_table');
hot2 = new Handsontable(container2, {
        width: 500,
        height: 500,
        data: [
            {
                name: "Alex",
                birthdate: 35886,
                city: "Cambridge"
            },
            {
                name: "Bob",
                birthdate: 36000,
                city: "Toronto"
            },
            {
                name: "Charlie",
                birthdate: 34000,
                city: "Waterloo"
            }
        ],
        colHeaders: [
            "Name",
            "Birth Date",
            "City"
        ],
        readOnly: false,
        columns: [
            {
                data: 'name',
                renderer: 'test_renderer'
            },
            {
                data: 'birthdate',
                renderer: 'column_date_renderer'
            },
            {
                data: 'city',
                renderer: 'column_map_renderer'
            }
        ]
    }
);

// FROM: https://www.codeproject.com/Articles/2750/Excel-serial-date-to-Day-Month-Year-and-vise-versa
function serialToDMY(serial)
{
    if (typeof serial !== "number") serial = parseInt(serial);
    if (isNaN(serial) || serial === undefined || serial === null) return null;
    let D, M, Y;
    if (serial === 60)
    {
        D = 29;
        M = 2;
        Y = 1900;

        return new Date(M + "/" + D + "/" + Y);
    }
    else if (serial < 60)
    {
        serial++;
    }

    let l = serial + 68569 + 2415019;
    let n = Math.floor(( 4 * l ) / 146097);
    l = l - Math.floor(( 146097 * n + 3 ) / 4);
    let i = Math.floor(( 4000 * ( l + 1 ) ) / 1461001);
    l = l - Math.floor(( 1461 * i ) / 4) + 31;
    let j = Math.floor(( 80 * l ) / 2447);
    D = l - Math.floor(( 2447 * j ) / 80);
    l = Math.floor(j / 11);
    M = j + 2 - ( 12 * l );
    Y = 100 * ( n - 49 ) + i + l;

    return new Date(M + "/" + D + "/" + Y);
}

function dateObjectStringifier(date) {
    return (date.getDay() + 1) + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

//console.log(serialToDMY(35886));

function parseRowString(str, row_count) {

    str += "+";

    let shortcutTable = {
        all: false,
        even: false,
        odd: false,
        getEveryN: NaN
    };

    let currentStart = 0, currentEnd = 0;
    let start = true, end = false, shortcut = false;
    let groupings = [];
    let g = 0;
    let shortString = "";
    for (let i = 0; i < str.length; i++) {
        //console.log("------------------------------------------");
        let c = str.charAt(i);

        let num = parseInt(c);
        //console.log(c, isNaN(num));
        if (shortcut) {
            if (c === '+') {
                if (shortString.trim().toLocaleLowerCase() === "all") {
                    shortcutTable.all = true;
                    //console.log("shortcut used: 'all'");
                }
                else if (shortString.trim().toLocaleLowerCase() === "even") {
                    shortcutTable.even = true;
                }
                else if (shortString.trim().toLocaleLowerCase() === "odd") {
                    shortcutTable.odd = true;
                }
                else {
                    return null;
                }

                currentStart = 0;
                currentEnd = 0;
                start = true;
                end = false;
                shortcut = false;
                shortString = "";
            }/*
            else if (c === ' ') {
                if (shortString.trim() === "every") {
                    shortcutTable.all = true;
                    //console.log("shortcut used: 'all'");
                }
            }*/
            else {
                shortString += c;
            }

            continue;
        }

        if (!isNaN(num)) { // The character is a digit
            if (start) { // Currently looking for a starting value
                currentStart *= 10;
                currentStart += num;
            }
            else if (end) { // Currently looking for an ending value
                currentEnd *= 10;
                currentEnd += num;
            }
        }
        else {
            switch (c) {
                case '-': {
                    if (start) {
                        if (currentStart < 1 || currentStart > row_count) {
                            return null;
                        }
                        groupings[g] = {start: currentStart, end: NaN};
                        start = false;
                        end = true;
                    }
                    else if (end) {

                    }
                    break;
                }
                case '+': {
                    if (start) {
                        if (currentStart < 1 || currentStart > row_count) {
                            return null;
                        }
                        groupings[g] = {start: currentStart, end: currentStart};
                        g++;
                    }
                    else if (end) {
                        if (currentEnd < 1 || currentEnd > row_count) {
                            return null;
                        }
                        groupings[g].end = currentEnd;
                        g++;
                        start = true;
                        end = false;
                    }
                    currentStart = 0;
                    currentEnd = 0;
                    break;
                }
                default: {
                    shortString += c;
                    shortcut = true;
                    break;
                }
            }
        }
    }
    if (!shortcut && groupings[g] !== undefined) {
        groupings[g].end = currentEnd;
    }

    if (shortcutTable.even && shortcutTable.odd) {
        shortcutTable.even = false;
        shortcutTable.odd = false;
        shortcutTable.all = true;
    }
    else if (shortcutTable.even) {
        for (let j = 1; j <= row_count; j++) {
            if (j%2 === 0) {
                groupings.push({start: j, end: j});
            }
        }
    }
    else if (shortcutTable.odd) {
        for (let j = 1; j <= row_count; j++) {
            if (j%2 === 1) {
                groupings.push({start: j, end: j});
            }
        }
    }
    let neighbor_table = Array(row_count);

    if (shortcutTable.all) {
        for (let i = 0; i < row_count; i++) {
            neighbor_table[i] = true;
        }
        groupings = [{start: 1, end: row_count}];
    }
    else {
        for (let i = 0; i < row_count; i++) {
            neighbor_table[i] = false;
        }

        for (let j = 0; j < groupings.length; j++) {
            let s = groupings[j].start - 1;
            let e = groupings[j].end - 1;
            for (let x = s; x <= e; x++) {
                neighbor_table[x] = true;
            }
        }

        groupings = [];
        let start = 0;
        neighbor_table[-1] = false;
        neighbor_table[row_count] = false;
        for (let k = 0; k < neighbor_table.length; k++) {
            if (neighbor_table[k - 1] === false && neighbor_table[k] === true) {
                start = k + 1;
            }
            else if (neighbor_table[k - 1] === true && neighbor_table[k] === false) {
                groupings.push({start: start, end: k});
            }
        }
    }
    return {
        data: groupings,
        neighbors: neighbor_table
    };
}

testApp.controller('UploadController', function UploadController($scope) {

	const tab_length = 750;
	$scope.selectedSheet = 0;
	$scope.sheets = [];
    $scope.fileLoaded = false;
    $scope.hasHeader = true;
    $scope.readOnly = true;
    $scope.rangeString = "none";
    $scope.selectedRowsString = "none";
    $scope.selectedRows = [];
    $scope.parseError = false;
    $scope.cols = [];
    $scope.colOptions = [
        "Text",
        "Number",
        "Currency",
		"Percentage",
		"Season",
        "Date",
        "Time",
		"Address",
		"Country",
		"Color",
		"Material"
    ];

    $scope.dateFormatList = new Map();
    $scope.dateFormatList.set('Excel Date', 0);
    $scope.dateFormatList.set('Unix Time', 1);

    $scope.dateFormatList.set('YYYY-MM-DD', 2);
    $scope.dateFormatList.set('YYYY/MM/DD', 3);
    $scope.dateFormatList.set('YYYY.MM.DD', 4);
    $scope.dateFormatList.set('YY-MM-DD', 5);
    $scope.dateFormatList.set('YY/MM/DD', 6);
    $scope.dateFormatList.set('YY.MM.DD', 7);

    $scope.dateFormatList.set('DD-MM-YYYY', 8);
    $scope.dateFormatList.set('DD/MM/YYYY', 9);
    $scope.dateFormatList.set('DD.MM.YYYY', 10);
    $scope.dateFormatList.set('DD-MM-YY', 11);
    $scope.dateFormatList.set('DD/MM/YY', 12);
    $scope.dateFormatList.set('DD.MM.YY', 13);

    $scope.dateFormatList.set('MM-DD-YYYY', 14);
    $scope.dateFormatList.set('MM/DD/YYYY', 15);
    $scope.dateFormatList.set('MM.DD.YYYY', 16);
    $scope.dateFormatList.set('MM-DD-YY', 17);
    $scope.dateFormatList.set('MM/DD/YY', 18);
    $scope.dateFormatList.set('MM.DD.YY', 19);

    $scope.dateFormatList.set('YYYYMMDD', 19);
    $scope.dateFormatList.set('YYMMDD', 20);
    $scope.dateFormatList.set('DDMMYYYY', 21);
    $scope.dateFormatList.set('DDMMYY', 22);
    $scope.dateFormatList.set('MMDDYYYY', 23);
    $scope.dateFormatList.set('MMDDYY', 24);

    $scope.currencyList = new Map();
    $scope.currencyList.set('DOLLAR', '$');
    $scope.currencyList.set('EURO', '€');
    $scope.currencyList.set('POUND', '£');
    $scope.currencyList.set('YEN', '¥');
    $scope.currencyList.set('WON', '₩');
    $scope.currencyList.set('RUPEE', '₹');
    $scope.currencyList.set('RUBLE', '₽');

    $scope.getDateFormatOptions = function() {
        return Array.from($scope.dateFormatList.keys());
    };

    $scope.getCurrencyFormatOptions = function() {
        return Array.from($scope.currencyList.keys());
    };

    $scope.sheetTabStyle = function(n) {
    	return {
    		background: ($scope.selectedSheet === n ? '#DDDDDD' : '#EEEEEE'),
    		border: '1px solid grey',
			display: 'inline-block',
			height: '50px',
			width: (Math.floor(tab_length / $scope.sheets.length) - 2) + 'px',
			cursor: 'pointer'
		};
	};

    $scope.selectSheet = function (n) {
		$scope.selectedSheet = n;
		//hot[n].render();
	};

    $scope.file_changed = function(element) {
        let file = element.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function(e) {
            $scope.fileName = file.name;
            $scope.fileType = fileMap.get(file.type);
            $scope.fileSize = toByteName(file.size);

            let tableData = new Uint8Array(reader.result);
            let wb = XLSX.read(tableData, {type: 'array'});

			//console.log(wb);

            for (let i = 0; i < (wb.SheetNames.length < 5 ? wb.SheetNames.length : 4); i++) {
            	$scope.sheets[i] = {
            		name: wb.SheetNames[i],
					number: i,
				};

            	let jsonData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]], {
					header: 1,
					raw: true,
					defval: ''
				});

				let c = jsonData[0].length;
				$scope.numRows = jsonData.length;

				$scope.cols[i] = new Array(c);
				for (let j = 0; j < c; j++) {
					($scope.cols[i])[j] = {
						colIndex: j,
						renderer: 'column_text_renderer',
						typeOfData: 'Text'
					};
				}

				let container = document.getElementById('table_' + i);
				hot[i] = new Handsontable(container, {
						width: 750,
						height: 500,
						data: jsonData,
						//columns: $scope.cols[i],
						colHeaders: true,
						readOnly: $scope.readOnly,
					}
				);
				hot[i].render();
			}

			/*
            $scope.jsonData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
                    header: 1,
                    raw: true,
                    defval: ''
            });

            let c = $scope.jsonData[0].length;
            $scope.numRows = $scope.jsonData.length;

            $scope.cols.push(new Array(c));
            for (let j = 0; j < c; j++) {
				($scope.cols[i])[j] = {
                    colIndex: j,
                    renderer: 'column_text_renderer',
                    typeOfData: 'Text'
                };
            }

            let container = document.getElementById('table_1');
            hot = new Handsontable(container, {
                    width: 750,
                    height: 500,
                    data: $scope.jsonData,
                    columns: $scope.cols,
                    colHeaders: true,
                    readOnly: $scope.readOnly,
                }
            );
            */

            $scope.fileLoaded = true;
            $scope.headerCheck();
            $scope.$apply();
        };
        //reader.readAsDataURL(file);
   };

    $scope.dataTypeChange = function(col) {

        switch (col.typeOfData) {
            case "Text": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_text_renderer";
                break;
            }
            case "Number": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_number_renderer";
                break;
            }
            case "Currency": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_currency_renderer";
                break;
            }
			case "Percentage": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_percent_renderer";
				break;
			}/*
			case "Fraction": {
				$scope.cols[col.colIndex].renderer = "column_fraction_renderer";
				break;
			}*/
            case "Date": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_date_renderer";
                break;
            }
			case "Color": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_color_renderer";
				break;
			}
			case "Address": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_map_renderer";
				break;
			}
			case "Country": {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "column_map_renderer";
				break;
			}
            default: {
				($scope.cols[$scope.selectedSheet])[col.colIndex].renderer = "test_renderer";
                break;
            }
        }

        hot[$scope.selectedSheet].updateSettings({
            columns: $scope.cols[$scope.selectedSheet]
        });
    };

    $scope.editCell = function(r, c, data) {
        hot[$scope.selectedSheet].setDataAtCell(r, c, data);
    };

    $scope.tableSelect = function() {
        if (hot[$scope.selectedSheet] !== null && hot[$scope.selectedSheet] !== undefined) {
            let rng = hot[$scope.selectedSheet].getSelectedRange();
            $scope.rangeString = "From (" + rng.from.row + ", " + rng.from.col + ") to (" + rng.to.row + ", " + rng.to.col + ").";
        }
    };

    $scope.setReadOnly = function() {
    	for (let i = 0; i < $scope.sheets.length; i++) {
			hot[i].updateSettings({
				readOnly: $scope.readOnly
			});
		}
    };
    
    $scope.headerCheck = function (headerLines) {
        if (hot[$scope.selectedSheet] === null) {
            return;
        }

        if (headerLines === undefined) headerLines = 1;

        let datlen = hot[$scope.selectedSheet].getDataAtRow(0).length;

        if ($scope.hasHeader) {

            let hide = [], temp = [], head = [];

            // 'hide' will be an array of the rows to hide, [0, 1, 2, ...]
            // 'head' will be an array of the header titles, created from the contents of the header rows
            for (let i = 0; i < headerLines; i++) {
                hide[i] = i;
                temp[i] = hot[$scope.selectedSheet].getDataAtRow(i);
                for (let j = 0; j < temp[i].length; j++) {
                    if (head[j] === undefined) {
                        head[j] = "";
                    }
                    head[j] += (temp[i])[j] + (i === headerLines - 1 ? '' : ', ');
                }
            }

            hot[$scope.selectedSheet].updateSettings({
                colHeaders: head,
                hiddenRows: {
                    rows: hide,
                    indicators: false
                }
            });
        }
        else {
            let colNames = [];
            for (let i = 0; i < datlen; i++) {
                colNames[i] = "Column " + (i + 1);
            }
            hot[$scope.selectedSheet].updateSettings({
                colHeaders: colNames,
                hiddenRows: {}
            });
        }
    };

    $scope.parseRowString = function(str, r) {
        let p = parseRowString(str, r);
        if (p === null) {
            $scope.selectedRowsString = "ERROR";
        }
        else {
            $scope.selectedRows = p.neighbors;
            $scope.selectedRowsString = p.data;
            //console.log($scope.selectedRows);
        }
    };
    
    $scope.readDateFormat = function (str) {
        if (str === undefined || str === null || str.length === 0)
        str = str.replace(/\s/g,''); // Remove all whitespace
        let l = str.length;
        console.log(str, l);
        let order = [];
        let divider = null;
        for (let i = 0; i < l; i++) {
            let c = str.charAt(i);

            switch (c) {
                case 'Y':
                case 'y':
                case 'M':
                case 'm':
                case 'D':
                case 'd': {
                    if (order.indexOf(c.toLowerCase()) === -1) {
                        order.push(c.toLowerCase());
                    }
                    break;
                }
                default: {
                    if (divider === null) {
                        divider = c;
                    }
                    break;
                }
            }
        }
        console.log(order, divider);
        return order;
    };
    
    $scope.changeDateFormat = function () {
        console.log($scope.dateFormat);
    };
});