var testApp = angular.module('testApp', []);

var errors = {
    noErr: '',
    errNoName: 'Please enter a name for the item.',
    errNoImg: 'Please enter a URL for the image.',
    errNothing: 'Please enter a name and URL.',
    errEmpty: 'Nothing to pop from this stack!'
};

testApp.filter('reverse', function () {
    return function (items) {
        return items.reverse();
    };
});

testApp.controller('TestController', function TestController($scope) {

    $scope.newItemName = "";
    $scope.newItemImg = "";
    $scope.currentError = errors.noErr;

    $scope.add = function () {

        var name = $scope.newItemName.trim();
        var img = $scope.newItemImg.trim();

        if (name === '' && img === '') {
            $scope.currentError = errors.errNothing;
            $scope.showError = true;
        } else if (img === '') {
            $scope.currentError = errors.errNoImg;
            $scope.showError = true;
        } else if (name === '') {
            $scope.currentError = errors.errNoName;
            $scope.showError = true;
        } else {
            $scope.listOfItems.push({
                name: name,
                desc: '',
                image: img
            });
            $scope.currentError = errors.noErr;
            $scope.showError = false;
        }
    };

    $scope.pop = function () {
        if ($scope.listOfItems.length > 0) {
            $scope.listOfItems.pop();
            $scope.currentError = errors.noErr;
            $scope.showError = false;
        } else {
            $scope.currentError = errors.errEmpty;
            $scope.showError = true;
        }
    };
    $scope.listOfItems = [
        {
            name: 'Dog',
            desc: '',
            image: 'https://i.ytimg.com/vi/SfLV8hD7zX4/maxresdefault.jpg'
        },
        {
            name: 'Cat',
            desc: '',
            image: 'https://www.argospetinsurance.co.uk/assets/uploads/2017/12/cat-pet-animal-domestic-104827.jpeg'
        },
        {
            name: 'Tree',
            desc: '',
            image: 'https://vignette.wikia.nocookie.net/joke-battles/images/a/ac/Tree.png/revision/latest?cb=20170827155628'
        },
        {
            name: 'Brick',
            desc: '',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Brick.jpg/1200px-Brick.jpg'
        }
    ];
});
