var myApp = angular.module("myApp", ['ngAnimate', 'ui.bootstrap']);

myApp.controller("ctrl", function($scope) {
    $scope.scopeValue = 'Initial scope value from ctrl';
    $scope.change=true;

    $scope.n = function(){
        return Math.floor((Math.random() * 99) + 1);
    };

    $scope.people = [
        {"name": "jum", "Emails": $scope.n(), "Social Networks":100, "Internet Banking":$scope.n(),"News Sportsites":100, "Search Engine":$scope.n(), "View Shopping sites": $scope.n()},
        {"name": "jum", "Emails": $scope.n(), "Social Networks":$scope.n(), "Internet Banking":$scope.n(),"News Sportsites":$scope.n(), "Search Engine":$scope.n(), "View Shopping sites": $scope.n()}
    ];

    $scope.add = function(){
        $scope.people.push({"name": "jum", "Emails": $scope.n(), "Social Networks":$scope.n(), "Internet Banking":$scope.n(),"News Sportsites":$scope.n(), "Search Engine":$scope.n(), "View Shopping sites": $scope.n()});

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

    $scope.chart2 = {};
    $scope.chart2.value = .70;
    $scope.chart2.total = 1;

    $scope.chart2.config = {
        filter: 'number',
        sections: 100,
        colors: [
            "#2FC2E0",
            "#3EB1D6",
            "#4EA0CC",
            "#5D90C2",
            "#6D7FB8",
            "#7C6FAE",
            "#8C5EA4",
            "#9C4E9B",
            "#A16097",
            "#8E6B92",
            "#7B768D",
            "#698189",
            "#568C84",
            "#449780",
            "#31A27B",
            "#1FAD77",
            "#3FB172",
            "#54B76A",
            "#69BD62",
            "#7EC35A",
            "#93C953",
            "#A8CF4B",
            "#BDD543",
            "#D2DB3C",
            "#CAC950",
            "#CEB54B",
            "#D2A247",
            "#D78E43",
            "#DB7B3F",
            "#DF683A",
            "#E45436",
            "#E84132",
            "#ED2E2E"
        ],
        thickness: 20,
        transparency: 1,
        stroke: 0
    };

//    pop up
    $scope.config = {
    };

    $scope.config2 = {
        position: 'bottom',
        showOnClick: true
    };

    $scope.config3 = {
        position: 'left'
    };

    $scope.config4 = {
        position: 'right'
    };

    $scope.isPopover = 'this is the text';

    $scope.item = {};
    $scope.config={name:'countries'};

//    drop down directive

    $scope.locations = [
        {    name: 'Antarctica'
        },
        {    name: 'Europe',
            children: [
                {    name: 'Italy',
                    children: [
                        {name: 'Rome'},
                        {name: 'Milan',
                            children: [
                                {name: 'West Side'},
                                {name: 'East Side'}
                            ]}
                    ]},
                {    name: 'Spain'}
            ]
        },
        {    name: 'South America',
            children: [
                {    name: 'Brasil'   },
                {    name: 'Peru' }
            ]
        },
        {    name: 'North America',
            children: [
                {    name: 'United States'   },
                {    name: 'Canada' }
            ]
        },
        {    name: 'Africa',
            children: [
                {    name: 'Morocco'   },
                {    name: 'Algeria' },
                {    name: 'Libya' },
                {    name: 'Egypt' },
                {    name: 'Sudan' },
                {    name: 'Eritrea' }
            ]
        }
    ];

    $scope.isCollapsed = true;
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

