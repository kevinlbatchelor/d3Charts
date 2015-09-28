myApp.directive('earth', ['$parse', '$window', '$filter', '$timeout', '$q', function ($parse, $window, $filter, $timeout, $q) {
    return{
        restrict: 'EA',
        scope: {
            text: '=',
            value: '=',
            total: '=',
            config: '=?'
        },

        link: function (scope, elem) {
            /*timeout is added to allow the css sizes to load before the javascript gets the elements sizes*/
            $timeout(function () {
                var svg, projection, path, sky, skyProjection, graticule, flyingArc, colorScale;

                var config = {
                    colors: ['#cdb879', '#9faf8e', '#8d5a2e', '#6d7265', '#8bc5e2' ],
                    sections: 20,
                    pathToEarth: 'js/earth/world-50m.json',
                    projection: d3.geo.eckert3
                };

                angular.extend(config, scope.config);

                var width = elem[0].offsetWidth;
                var height = elem[0].offsetHeight;

                var projectionFunction = config.projection;

                scope.resizeCharts = function () {
                    if (width !== elem[0].clientWidth || height !== elem[0].clientHeight) {
                        width = elem[0].clientWidth;
                        height = elem[0].clientHeight;
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
                    baseSvg();
                    draw();
                };

                var removeSvg = function () {
                    d3.select(elem[0]).select("svg").remove();
                };

                var swoosh = d3.svg.line()
                    .x(function (d) {
                        return d[0]
                    })
                    .y(function (d) {
                        return d[1]
                    })
                    .interpolate("cardinal")
                    .tension(.0);

                var baseSvg = function () {
                    projection = projectionFunction()
                        .scale((width + 1) / 2 / Math.PI)
                        .translate([width / 2, height / 2])
                        .precision(1);

                    skyProjection = projectionFunction()
                        .scale((width + 1) / 1.5 / Math.PI)
                        .translate([width / 2, height / 2])
                        .precision(.1);

                    path = d3.geo.path()
                        .projection(projection);

                    sky = d3.geo.path()
                        .projection(skyProjection);

                    var locationAlongArc = function (start, end, mod) {
                        var interpolator = d3.geo.interpolate(start, end);
                        return interpolator(mod)
                    };

                    flyingArc = function (pts) {
                        var source = pts.coordinates[0],
                            target = pts.coordinates[1];
                        var mid = locationAlongArc(source, target, .4);
                        return [ projection(source),
                            skyProjection(mid),
                            projection(target) ];
                    };

                    graticule = d3.geo.graticule();

                    svg = d3.select(elem[0]).append('svg')
                        .attr('width', width)
                        .attr('height', height);

                    svg.append("defs").append("path")
                        .datum({type: "Sphere"})
                        .attr("id", "sphere")
                        .attr("d", path);

                    svg.append("use")
                        .attr("class", "outline")
                        .attr("xlink:href", "#sphere");
                };

                var lineTransition = function lineTransition(path) {
                    path.transition()
                        .duration(5500)
                        .attrTween("stroke-dasharray", tweenDash)
                        .each("end", function (d, i) {
                        });
                };

                var tweenDash = function tweenDash() {
                    var len = this.getTotalLength();
                    var interpolate = d3.interpolateString("0," + len, len + "," + len);

                    return function (t) {
                        return interpolate(t);
                    };
                };

                var draw = function () {
                    svg.append("path")
                        .datum(graticule)
                        .attr("class", "graticule")
                        .attr("d", path);

                    d3.json(config.pathToEarth, function (error, world) {
                        svg.insert("path", ".graticule")
                            .datum(topojson.feature(world, world.objects.land))
                            .attr("class", "land")
                            .attr("d", path);

                        svg.insert("path", ".graticule")
                            .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
                                return a !== b;
                            }))
                            .attr("class", "boundary")
                            .attr("d", path);
                    });

                    d3.select(self.frameElement).style("height", height + "px");

                    scope.fade = d3.scale.quantile();
                    if (config.colors.length === 2) {
                        scope.fade = d3.scale.linear();
                    }

                };

                var runUpdate = function () {
                    update();
                    updateText(scope.text)
                };


                var update = function () {
                    var cords = scope.value;

                    colorScale = scope.fade.domain([0, scope.value.length])
                        .range(config.colors);

                    angular.forEach(cords, function (v, pointIttr) {
                        svg.append("path")
                            .data([cords[pointIttr]])
                            .attr("class", "arc")
                            .style('stroke-opacity',1)
                            .style('fill','none')
                            .attr('stroke', function (d, i) {
                                return colorScale(pointIttr);
                            })
                            .attr("d", function (d) {
                                return swoosh(flyingArc(d))
                            })
                            .call(lineTransition)
                            .transition().duration(500).style('stroke-opacity',0).delay(5000).remove();
                    });

                    $timeout(function () {
                            angular.forEach(cords, function (v, pointIttr) {
                                svg.append("circle")
                                    .data([cords[pointIttr]])
                                    .attr("class", "circle ping")
                                    .attr('stroke', function (d, i) {
                                        return colorScale(pointIttr);
                                    })
                                    .attr("cx", function (d) {
                                        var p = [d.coordinates[1][0], d.coordinates[1][1]];
                                        return projection(p)[0];
                                    })
                                    .attr("cy", function (d) {
                                        var p = [d.coordinates[1][0], d.coordinates[1][1]];
                                        return projection(p)[1];
                                    })
                                    .attr("r", 10)
                                    .transition().delay(2000).remove();
                            });
                        }
                        , 5000)
                };

                var updateText = function (text) {
                };

                var firstRun = true;
                scope.$watch('value', function () {
                    if (firstRun) {
                        drawChart();
                        firstRun = false;
                        return;
                    }
                    runUpdate();
                }, true);
            }, 500);
        }
    };
}]);

//http://bl.ocks.org/dwtkns/4973620
//http://bl.ocks.org/phil-pedruco/7745589
//http://bost.ocks.org/mike/map/