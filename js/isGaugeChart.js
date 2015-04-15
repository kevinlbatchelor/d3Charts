
myApp.directive('isGaugeChart',['$parse','$window','$filter','$timeout', function ($parse, $window, $filter, $timeout) {
            return{
                restrict: 'EA',
                scope: {
                    value: '=',
                    total: '=',
                    config: '=?'
                },

                link: function (scope, elem) {
                    $timeout(function () {
                        console.log(scope.value)
                        /*timeout is added to allow the css sizes to load before the javascript gets the elements sizes*/
                        var end;
                        /*How far the ring will progress around the circle*/
                        var d3 = $window.d3;

                        var w = elem[0].offsetWidth;
                        var h = elem[0].offsetHeight;

                        var radius = Math.min(h, w) / 2;
                        var svg = d3.select(elem[0]).append("svg")
                            .attr('class', 'isGaugeChart')
                            .attr('width', w)
                            .attr('height', h)
                            .append('g')
                            .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');

                        if (!scope.config) {
                            scope.config = {};
                        }

                        scope.thickness = 26;
                        if (scope.config.thickness || scope.config.thickness === 0) {
                            scope.thickness = scope.config.thickness;
                        }

                        if (scope.config.filter) {
                            scope.filter = $filter(scope.config.filter);
                        } else {
                            scope.config.filterParams = [0];
                            scope.filter = $filter('number');
                            /*if there is no filter provided to the directive, display the value as a number so the animation doesn't show decimal places when counting up*/
                        }

                        var arc = d3.svg.arc()
                            .innerRadius(radius)
                            .outerRadius(radius - scope.thickness);

                        scope.getFormat = function (number) {
                            var funcParams = [number].concat(scope.config.filterParams);
                            return scope.filter.apply(this, funcParams);
                            /* this provides parameters to the filter as a array using 'function.apply', so the filter can handle different amounts of parameters*/
                        };

                        scope.colors = ['#666'];
                        if (scope.config.colors) {
                            scope.colors = scope.config.colors;
                        }

                        scope.fade = d3.scale.quantile();
                        if (scope.colors.length === 2) {
                            scope.fade = d3.scale.linear();
                        }

                        scope.transparency = 0.7;
                        if (scope.config.transparency || scope.config.transparency === 0) {
                            scope.transparency = scope.config.transparency;
                        }

                        scope.stroke = 2;
                        if (scope.config.stroke || scope.config.stroke === 0) {
                            scope.stroke = scope.config.stroke;
                        }

                        scope.setUpData = function () {

                            if (!scope.config.sections) {
                                scope.config.sections = scope.total;
                            }

                            var normalSections = (scope.value * scope.config.sections) / scope.total;

                            scope.numberOfSections = _.map(_.range(Math.abs(normalSections)), function (i) {
                                return 1;
                            });

                            end = (((scope.value * 2) / scope.total) * Math.PI);
                        };

                        var draw = function () {
                            scope.setUpData();

                            var colorScale = scope.fade.domain([0, scope.config.sections])
                                .range(scope.colors);

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
                                .attr('stroke-width', scope.stroke)
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
                                .attr('opacity', scope.transparency);

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
                            draw();
                        });
                    });
                }
            };
        }]);

