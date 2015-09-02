myApp.controller("earthCtrl", function ($scope, $timeout, $interval) {

    $interval(function () {
        $scope.earthValue = [
            {1: _.random(30, 50), 0: _.random(-80, -106)}
        ];
    }, 1000);
});