myApp.controller("earthCtrl", function ($scope, $timeout, $interval) {

    var makeRandomMapPoints = function () {
        var mapPoints = [];
        for (var i = 0; i < _.random(3, 10); i++) {
            var anyState = _.random(0, 52);
            mapPoints.push(
                {
                    type: "LineString",
                    coordinates: [
                        [ -101.8453,35.1992],
                        [
                        states[anyState].LONGITUDE,
                        states[anyState].LATITUDE
                            ]
                    ]
                }
            );
        }

        return mapPoints;
    };

    $interval(function(){$scope.earthValue = makeRandomMapPoints()},1000);
    console.log($scope.earthValue);
});