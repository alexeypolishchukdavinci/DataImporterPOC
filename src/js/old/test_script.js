var data = [
    ["", "Ford", "Tesla", "Toyota", "Honda"],
    ["2017", 10, 11, 12, 13],
    ["2018", 20, 11, 14, 13],
    ["2019", 30, 15, 12, 13]
];

var container = document.getElementById('example');

console.log(data, container);
var hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: true
});