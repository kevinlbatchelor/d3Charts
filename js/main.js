var myApp = angular.module("myApp", ['ngAnimate']);

myApp.controller("ctrl", function($scope) {
    $scope.scopeValue = 'Initial scope value from ctrl';
    $scope.change=true;

    $scope.n = function(){
        return Math.floor((Math.random() * 99) + 1);
    };

    $scope.people = [
        {"name": "jum", "Emails": $scope.n(), "Social Networks":$scope.n(), "Internet Banking":$scope.n(),"News Sportsites":$scope.n(), "Search Engine":$scope.n(), "View Shopping sites": $scope.n()},
        {"name": "jum", "Emails": $scope.n(), "Social Networks":$scope.n(), "Internet Banking":$scope.n(),"News Sportsites":$scope.n(), "Search Engine":$scope.n(), "View Shopping sites": $scope.n()}
    ];

    $scope.add = function(){

        $scope.people.push({"name": "jum", "Emails": $scope.n(), "Social Networks":$scope.n(), "Internet Banking":$scope.n(),"News Sportsites":$scope.n(), "Search Engine":$scope.n(), "View Shopping sites": $scope.n()});
        console.log($scope.people);
    };

    $scope.keys = [
        {label:"News Sportsites", key:"News Sportsites", total:"100"},
        {label:"Search Engine", key:"Search Engine", total:"100"},
        {label:"Hammer", key:"Emails", total:"100"},
        {label:"View Shopping sites", key:"View Shopping sites", total:"100"},
        {label:"Internet Banking", key:"Internet Banking", total:"100"},
        {label:"Social Networks", key:"Social Networks", total:"100"}
    ];

    $scope.config = {
        w: 500,
        h: 500,
        levels: 4,
        ExtraWidthX: 300,
        showScale:true
    };


});

myApp.directive('oneT', function() {
    return {
        restrict: 'E',
        scope: {
            item:'='
        },
        template: "<two-t tree='item'></two-t>",

        link: function (scope, element, attrs){
            console.log(scope.item)
            }

    };
});
myApp.directive('twoT', function() {
    return {
        restrict: 'E',
        scope: {
            tree:'='
        },
        template: "<div>Content from second directives template</div>{{tree}}",

        link: function (scope, element, attrs, oneCtrl){
            console.log(scope.tree)
            }

    };
});