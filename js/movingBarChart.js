myApp.directive('movingBarChart', ['$parse', '$window', '$filter', '$timeout', function ($parse, $window, $filter, $timeout, $watch) {
    return{
        restrict: 'E',
        scope: {
            newNumber: '=',
            config: '='
        },

        link: function (scope, elem) {
            $timeout(function () {

                var count = 0;
                var remove = 0;
                var config = {
                    w: 700,
                    h: 100,
                    width: 12,
                    slideOver: -12,
                    scale: 10000,
                    colorOne: 'white',
                    colorTwo: '#44abda',
                    margin: {top: 20, right: 20, bottom: 20, left: 20}
                };

                angular.extend(config, scope.config);

                config.w = elem[0].offsetWidth;
//                config.h = elem[0].offsetHeight;
                console.log(elem[0].offsetWidth);
//                console.log(elem[0].offsetHeight);

                var barsToShow = config.w / 13;
                scope.dataSet = [];


                var svg = d3.select(elem[0]).append("svg")
                    .attr('width', config.w + config.margin.left + config.margin.right)
                    .attr('height', config.h + config.margin.top + config.margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + config.margin.left + ', ' + config.margin.top + ')');

                var yScale = d3.scale.linear()
                    .domain([0, config.scale])
                    .range([0, config.h]);

                scope.$watch('newNumber', function () {
                    count++;
                    scope.dataSet.push(scope.newNumber);

                    svg.selectAll('rect').data(scope.dataSet)
                        .enter().append('rect')
                        .attr('class', 'bar' + count)
                        .attr('x', function () {
                            config.width = config.width + 12;
                            return config.width;
                        })
                        .attr('y', function (d) {
                            return config.h - yScale(d);
                        })
                        .attr('width', 10)
                        .attr('height', yScale)
                        .attr('fill', function (d, i) {
                            return config.colorOne;
                        })
                        .transition()
                        .attr('fill', function (d, i) {
                            return config.colorTwo;
                        });

                    if (count > barsToShow) {
                        remove++;
                        config.slideOver = config.slideOver - 12;
                        svg.attr('transform', 'translate(' + config.slideOver + ', ' + config.margin.top + ')');
                        svg.select('.bar' + remove).remove();
                        scope.dataSet.shift();
                    }
                });
            }, 500);
        }
    };
}]);