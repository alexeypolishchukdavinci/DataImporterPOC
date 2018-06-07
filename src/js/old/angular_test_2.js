var testApp = angular.module('testApp', []);

function Heap() {

    this.heap = [];

    this.get = function (i) {
        return this.heap[i];
    }

    this.leftChild = function (index) {
        return (index * 2) + 1;
    }

    this.rightChild = function (index) {
        return (index * 2) + 2;
    }

    this.parent = function (index) {
        if (index < 1) {
            return 'err';
        } else {
            return Math.floor((index - 1) / 2);
        }
    }

    this.push = function (item) {
        var i = this.heap.length;
        this.heap.push(item);
        this.heapifyUp(i);
    }

    this.pop = function () {
        var i = this.heap.length - 1;
        this.heapifyDown();
    }

    this.heapifyUp = function (index) {
        var i = this.heap[index];
        var p = this.heap[this.parent(index)];
        if (index === 0 || p > i) {
            return;
        } else {
            this.heap[this.parent(index)] = i;
            this.heap[index] = p;
            this.heapifyUp(this.parent(index));
        }
    }

    this.heapifyDown = function (index) {

    }

    this.heapString = function () {
        return this.heap.toString();
    }
}

testApp.controller('HeapController', function HeapController($scope) {
    var obj = new Heap();
    $scope.heapText = '';
    $scope.heapObj = {
        length: 0,
        rows: []
    };

    $scope.printHeap = function () {
        $scope.heapText = obj.heapString();
    }

    $scope.getHeap = function () {
        return obj.heap;
    }

    /*
    function elementAt(row, col) {
        var x = Math.pow(row, 2) + col;
        if (x >= obj.heap.length) {
            return '';
        } else {
            return obj.heap[x];
        }
    }
    */

    function populateHeapObj() {
        var i = 1;
        var pos = -1;
        obj.heap.forEach(function (e) {
            if (pos != Math.floor(Math.log2(i))) {
                $scope.heapObj.rows[pos + 1] = [];
            }
            pos = Math.floor(Math.log2(i));
            if ($scope.heapObj.rows[pos] == undefined) {
                $scope.heapObj.rows[pos] = [];
            }
            $scope.heapObj.rows[pos].push(e);
            i++;
        });
        
        console.log($scope.heapObj);
    }

    $scope.pushItem = function () {
        var i = parseInt($scope.newItem);
        $scope.newItem = '';
        if (isNaN(i)) {
            return;
        } else {
            obj.push(i);
        }
        $scope.heapText = obj.heapString();
        $scope.heapObj.length = obj.heap.length;
        populateHeapObj();
    }

    $scope.tableRowCount = function () {
        if (obj.heap.length < 1) {
            return [];
        } else {
            var len = Math.floor(Math.log2(obj.heap.length)) + 1;
            return new Array(len);
        }
    }

    $scope.tableColumnCount = function (i) {
        var len = Math.pow(i, 2);
        return new Array(4);
    }
});
