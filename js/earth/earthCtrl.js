myApp.controller("earthCtrl", function ($scope, $timeout, $interval) {

    $interval(function () {
        $scope.earthValue = [
            {1: _.random(30, 50), 0: _.random(-80, -106)}
        ];
    }, 1000);

    var m = function (){
        return  _.random(38.58, 38.2);
    };
    var m2= function (){
        return  _.random(-101, -121.49);
    };

    $interval(function () {
        $scope.earthValue2 =  [
            {
                type: "LineString",
                coordinates: [
                    [ -121.49, 38.58 ],
                    [ -74.005941 , 40.712784 ]

                ]
            }
        ];
    }, 1000);
});