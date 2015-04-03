var myApp = angular.module("myApp", ['ngAnimate']);

myApp.controller("ctrl", function($scope) {
    $scope.scopeValue = 'Initial scope value from ctrl';
    $scope.change=true;

    $scope.people = [
        {"name": "jum", "Emails": 50, "Social Networks":56, "Internet Banking":42,"News Sportsites":34, "Search Engine":48, "View Shopping sites": 14},
        {"name": "dim","Emails": 50, "Social Networks":51, "Internet Banking":48,"News Sportsites":24, "Search Engine":38, "View Shopping sites": 20}
    ];

    $scope.add = function(){

        $scope.people.push({"name": "ham","Emails": 90, "Social Networks":70, "Internet Banking":50,"News Sportsites":66, "Search Engine":38, "View Shopping sites": 20});
        console.log($scope.people);
    };

    $scope.keys = [
        {label:"News Sportsites", key:"News Sportsites", max:"100"},
        {label:"Search Engine", key:"Search Engine", max:"100"},
        {label:"Hammer", key:"Emails", max:"100"},
        {label:"View Shopping sites", key:"View Shopping sites", max:"100"},
        {label:"Internet Banking", key:"Internet Banking", max:"100"},
        {label:"Social Networks", key:"Social Networks", max:"100"},
        {label:"Listing Radio", key:"Listing Radio", max:"100"},
        {label:"Reading", key:"Reading", max:"100"},
    ];

    $scope.config = {
        w: 500,
        h: 500,
        levels: 4,
        ExtraWidthX: 300,
        showScale:false
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