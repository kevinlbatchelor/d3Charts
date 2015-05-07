
myApp.directive('gaugeChart', ['$parse', '$window', '$filter', '$timeout', function ($parse, $window, $filter, $timeout) {
    return{
        restrict: 'EA',
        scope: {
            value: '=',
            total: '=',
            config: '=?'
        },

        link: function (scope, elem) {
            /*timeout is added to allow the css sizes to load before the javascript gets the elements sizes*/
            $timeout(function () {

                scope.cfg = {
                    filter: 'number',
                    filterParams: undefined,
                    sections: null,
                    colors: ['#666'],
                    thickness: 26,
                    stroke: 2,
                    transparency: 0.7
                };

                angular.extend(scope.cfg, scope.config);

                /*end is how far the ring will progress around the circle*/
                var end, arc, radius, svg;
                var d3 = $window.d3;

                scope.w = elem[0].offsetWidth;
                scope.h = elem[0].offsetHeight;

                scope.resizeCharts = function () {
                    if (scope.w !== elem[0].clientWidth || scope.h !== elem[0].clientHeight) {
                        scope.w = elem[0].clientWidth;
                        scope.h = elem[0].clientHeight;
                        drawChart();
                    }
                };
                var apply = function () {
                    scope.$apply();
                };

                var windowEle = angular.element($window);
                windowEle.bind('resize', apply);
                scope.$on('$destroy', function () {
                    windowEle.unbind('resize', apply);
                });

                scope.$watch(function () {
                    return {
                        w: elem[0].clientWidth,
                        h: elem[0].clientHeight
                    };
                }, scope.resizeCharts, true);

                var drawChart = function () {
                    removeSvg();
                    configSettings();
                    baseSvg();
                    draw();
                };

                var removeSvg = function(){
                    d3.select(elem[0]).select("svg").remove();
                };

                var baseSvg = function () {
                    radius = Math.min(scope.h, scope.w) / 2;
                    svg = d3.select(elem[0]).append("svg")
                        .attr('class', 'isGaugeChart')
                        .attr('width', scope.w)
                        .attr('height', scope.h)
                        .append('g')
                        .attr('transform', 'translate(' + scope.w / 2 + ',' + scope.h / 2 + ')');

                    arc = d3.svg.arc()
                        .innerRadius(radius)
                        .outerRadius(radius - scope.cfg.thickness);
                };

                var configSettings =  function(){
                    if (scope.cfg.filter === 'number' && angular.isUndefined(scope.cfg.filterParams)) {
                        scope.cfg.filterParams = [0];
                    }

                    scope.filter = $filter(scope.cfg.filter);

                    /* this provides parameters to the filter as a array using 'function.apply', so the filter can handle different amounts of parameters*/
                    scope.getFormat = function (number) {
                        var funcParams = [number].concat(scope.cfg.filterParams);
                        return scope.filter.apply(this, funcParams);
                    };

                    scope.fade = d3.scale.quantile();
                    if (scope.cfg.colors.length === 2) {
                        scope.fade = d3.scale.linear();
                    }

                };

                scope.setUpData = function () {
                    if (!scope.cfg.sections) {
                        scope.cfg.sections = scope.total;
                    }

                    var normalSections = (scope.value * scope.cfg.sections) / scope.total;

                    scope.numberOfSections = _.map(_.range(Math.abs(normalSections)), function (i) {
                        return 1;
                    });
                    end = (((scope.value * 2) / scope.total) * Math.PI);
                };

                var draw = function () {
                    scope.setUpData();

                    var colorScale = scope.fade.domain([0, scope.cfg.sections])
                        .range(scope.cfg.colors);

                    var pie = d3.layout.pie()
                        .sort(null)
                        .startAngle(0)
                        .endAngle(end);

                    svg.selectAll(".arc").remove();

                    svg.selectAll(".arc")
                        .data(pie(scope.numberOfSections))
                        .enter()
                        .append('g')
                        .attr('class', 'arc')
                        .append('path')
                        .attr('class', function (d, i) {
                            return 'arc-' + i;
                        })
                        .attr('fill', '#1b2428')
                        .attr('opacity', 0)
                        .attr("d", arc)
                        .attr('stroke', '#fff')
                        .attr('stroke-width', scope.cfg.stroke)
                        .attr('width', 50)
                        .attr("height", 0)
                        .transition()
                        .delay(function (d, i) {
                            return i * 10;
                        })
                        .attr('height', 1)
                        .attr('fill', function (d, i) {
                            return colorScale(i);
                        })
                        .attr('opacity', scope.cfg.transparency);

                    svg.selectAll(".txt").remove();

                    svg.append('text')
                        .attr('dy', '.35em')
                        .attr('text-anchor', 'middle')
                        .attr('class', 'txt')
                        .attr('style', 'font-size:' + radius * 0.5 + 'px')
                        .text(0)
                        .data([scope.value])
                        .transition()
                        .ease('cubic-out')
                        .duration(1000)
                        .tween('text', function (d) {
                            var i = d3.interpolate(this.textContent, d);
                            return function (t) {
                                this.textContent = scope.getFormat(i(t));
                            };
                        });
                };

                scope.$watch('value', function () {
                    drawChart();
                });
            });
        }
    };
}]);