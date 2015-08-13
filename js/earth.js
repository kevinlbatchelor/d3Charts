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
                var svg, projection, path, graticule;

                var config = {
                    colors: ['#666', '#fff'],
                    sections: 2
                };

                angular.extend(config, scope.config);

                var width = elem[0].offsetWidth;
                var height = elem[0].offsetHeight;
                var color = d3.scale.linear().domain([0, config.sections])
                    .range(config.colors);

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

                var baseSvg = function () {
                    projection = d3.geo.mercator()
                        .scale((width + 1) / 2 / Math.PI)
                        .translate([width / 2, height / 2])
                        .precision(.1);

                    path = d3.geo.path()
                        .projection(projection);

                    graticule = d3.geo.graticule();

                    svg = d3.select(elem[0]).append('svg')
                        .attr('width', width)
                        .attr('height', height);
                };

                var draw = function () {

                    svg.append("path")
                        .datum(graticule)
                        .attr("class", "graticule")
                        .attr("d", path);

                    queue()
                        .defer(d3.json, "js/earthData.json")
                        .await(ready);

                    function ready(error, world, airports) {

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
                    }

                    d3.select(self.frameElement).style("height", height + "px");
                };

                var runUpdate = function () {
                    update();
                    updateText(scope.text)
                };

                var update = function (data) {
                    console.log('fire');
                    var cords = scope.value;
                    svg.append("path")
                        .datum({type: "MultiPoint", coordinates: cords})
                        .attr("class", "contactPoints ping")
                        .attr("d", path);
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