myApp.controller("dashboardBarCtrl", function ($scope, $timeout) {

    $scope.tempCount = 1;
    var numberOfBars = 2000;
    $scope.fakeData = function () {
        $scope.newNumber = 0;
        $timeout(function () {
            $scope.tempCount++;
            if ($scope.tempCount < numberOfBars) {
                $scope.fakeData();
            }
            $scope.newNumber = Math.floor((Math.random() * 5999) + 1);
        }, 100);
        return $scope.newNumber;
    };
    $scope.fakeData();



    
//    $scope.data = '';
//    var getData = function () {
//        $timeout(function () {
//            $scope.data = dataSummary.data.interactionsPerMinute;
//            console.log($scope.data+'ang');
//            getData();
//        }, 1000);
//        return $scope.data;
//    };
//    getData();
//
//    $scope.$watch('data', function () {
//        console.log($scope.data);
//    })
});