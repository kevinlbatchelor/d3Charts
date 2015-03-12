var myApp = angular.module("myApp", ['ngAnimate']);

myApp.controller("ctrl", function($scope) {
    $scope.scopeValue = 'Initial scope value from ctrl';
    $scope.change=true;
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