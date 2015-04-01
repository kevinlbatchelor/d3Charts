var myApp = angular.module("myApp", ['ngAnimate']);

myApp.controller("ctrl", function($scope) {
    $scope.scopeValue = 'Initial scope value from ctrl';
    $scope.change=true;

    $scope.people = [
//        {name:"jim", "Emails": 100, "Reading": 6, "Listing Radio": 6, "ducks":100},
        {"Emails": 0.8, "Social Networks":0.056, "Internet Banking":0.42,"News Sportsites":0.34, "Search Engine":0.48, "View Shopping sites": 0.14},
        {name:"sam", "Emails": 60, "Reading": 4, "Listing Radio": 3},
        {name:"hal", "Emails": 40, "Reading": 2, "Listing Radio": 8},
        {name:"boo", "Emails": 70, "Reading": 6, "Listing Radio": 9},
        {name:"tim", "Emails": 40, "Reading": 2, "Listing Radio": 2},
        {name:"mat", "Emails": 20, "Reading": 4, "Listing Radio": 4}
    ];

    $scope.keys = [
        {label:"News Sportsites", key:"News Sportsites", max:"100"},
        {label:"Search Engine", key:"Search Engine", max:"100"},
        {label:"Emails", key:"Emails", max:"100"},
        {label:"View Shopping sites", key:"View Shopping sites", max:"100"},
        {label:"Internet Banking", key:"Internet Banking", max:"100"},
        {label:"Social Networks", key:"Social Networks", max:"100"}
    ];

    $scope.data = [
        [
            {axis: "Email", value: 0.8},
            {axis: "Social Networks", value: 0.56},
            {axis: "Internet Banking", value: 0.42},
            {axis: "News Sportsites", value: 0.34},
            {axis: "Search Engine", value: 0.48},
            {axis: "View Shopping sites", value: 0.14}
        ],
        [
            {axis: "Email", value: 0.48},
            {axis: "Social Networks", value: 0.41},
            {axis: "Internet Banking", value: 0.27},
            {axis: "News Sportsites", value: 0.28},
            {axis: "Search Engine", value: 0.46},
            {axis: "View Shopping sites", value: 0.29}
        ]
    ];

    $scope.config = {
        w: 500,
        h: 500,
        maxValue: 1,
        levels: 6,
        ExtraWidthX: 300
    };

//    $scopeOrg.data = [
//        [
//            {axis: "Email", value: 0.8},
//            {axis: "Social Networks", value: 0.56},
//            {axis: "Internet Banking", value: 0.42},
//            {axis: "News Sportsites", value: 0.34},
//            {axis: "Search Engine", value: 0.48},
//            {axis: "View Shopping sites", value: 0.14},
//            {axis: "Paying Online", value: 0.11},
//            {axis: "Buy Online", value: 0.05},
//            {axis: "Stream Music", value: 0.07},
//            {axis: "Online Gaming", value: 0.12},
//            {axis: "Navigation", value: 0.27},
//            {axis: "App connected to TV program", value: 0.03},
//            {axis: "Offline Gaming", value: 0.12},
//            {axis: "Photo Video", value: 0.4},
//            {axis: "Reading", value: 0.03},
//            {axis: "Listen Music", value: 0.22},
//            {axis: "Watch TV", value: 0.03},
//            {axis: "TV Movies Streaming", value: 0.03},
//            {axis: "Listen Radio", value: 0.07},
//            {axis: "Sending Money", value: 0.18},
//            {axis: "Other", value: 0.07},
//            {axis: "Use less Once week", value: 0.08}
//        ],
//        [
//            {axis: "Email", value: 0.48},
//            {axis: "Social Networks", value: 0.41},
//            {axis: "Internet Banking", value: 0.27},
//            {axis: "News Sportsites", value: 0.28},
//            {axis: "Search Engine", value: 0.46},
//            {axis: "View Shopping sites", value: 0.29},
//            {axis: "Paying Online", value: 0.11},
//            {axis: "Buy Online", value: 0.14},
//            {axis: "Stream Music", value: 0.05},
//            {axis: "Online Gaming", value: 0.19},
//            {axis: "Navigation", value: 0.14},
//            {axis: "App connected to TV program", value: 0.06},
//            {axis: "Offline Gaming", value: 0.24},
//            {axis: "Photo Video", value: 0.17},
//            {axis: "Reading", value: 0.15},
//            {axis: "Listen Music", value: 0.12},
//            {axis: "Watch TV", value: 0.1},
//            {axis: "TV Movies Streaming", value: 0.14},
//            {axis: "Listen Radio", value: 0.06},
//            {axis: "Sending Money", value: 0.16},
//            {axis: "Other", value: 0.07},
//            {axis: "Use less Once week", value: 0.17},
//            {axis: "Use less Once week", value: 0.17},
//            {axis: "Use less Once week", value: 0.17}
//        ]
//    ];


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