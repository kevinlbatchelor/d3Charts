myApp.directive('eye', ['$parse', '$window', '$filter', '$timeout', '$q', function ($parse, $window, $filter, $timeout, $q) {
    return{
        restrict: 'EA',
        scope: {
            text:'=',
            value: '=',
            total: '=',
            config: '=?'
        },

        link: function (scope, elem) {
            /*timeout is added to allow the css sizes to load before the javascript gets the elements sizes*/
            $timeout(function () {
                var group, data, pie, baseArc, ringWidth, rad, radList;

                var config = {
                    colors:['#666','#fff'],
                    sections:scope.value.length
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

                var baseName= 'cir';
                var widthList = [];

                var startAngleList = [];

                var drawChart = function () {
                    radList = [];
                    removeSvg();
                    baseSvg();

                    _.forEach(scope.value, function (d, i) {
                        startAngleList.push(_.random(0, 6.24));
                        var ringWidth = _.random(4, 25);
                        widthList.push(ringWidth);
                        radList.push(rad);
                        var ringData = [];
                        ringData.push(d);
                        var section = 100 - d;
                        ringData.push(section);
                        draw(ringData, baseName + i, radList[i], widthList[i]-2, startAngleList[i]);
                        rad = rad - widthList[i];
                    });
                    drawText(rad);
                };

                var removeSvg = function () {
                    d3.select(elem[0]).select("svg").remove();
                };

                var baseSvg = function () {
                    rad = Math.min(height, width) / 2;
                    group = d3.select(elem[0]).append('svg')
                        .attr('width', width)
                        .attr('height', height)
                        .append('g')
                        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

                    pie = d3.layout.pie().value(function (d) {
                        return d;
                    }).sort(null);
                };

                var draw = function (data, name, radius, width, start) {
                    baseArc = group.datum(data)
                        .selectAll("." + name)
                        .data(pie)
                        .enter()
                        .append("path")
                        .attr("class", name)
                        .attr("fill", function (d, i) {
                            return color(i);
                        })
                        .attr("d", d3.svg.arc().startAngle(start)
                            .innerRadius(radius - width)
                            .outerRadius(radius))
                        .each(function (d) {
                            this._current = d;
                        });
                };

                var drawText = function (radius){
                    group.append('text')
                        .attr('dy', '.35em')
                        .attr('text-anchor', 'middle')
                        .attr('class', 'txt')
                        .attr('style', 'font-size:' + radius * 0.5 + 'px')
                        .text(scope.text);
                };

                var runUpdate = function(){
                    _.forEach(scope.value, function(d,i){
                        var ring = [];
                        ring.push(d);
                        var section = 100 - d;
                        ring.push(section);
                        update(ring, baseName + i, radList[i], widthList[i]-2, startAngleList[i]);
                    });
                    updateText(scope.text)
                };

                var update = function (data, name, radius, width, start) {
                    group.selectAll("."+name).data(pie(data.reverse()))
                        .transition()
                        .duration(750)
                        .attrTween("d", function (a) {
                            var localArc = d3.svg.arc().startAngle(start)
                                .innerRadius(radius - width)
                                .outerRadius(radius);

                            var i = d3.interpolate(this._current, a);
                            this._current = i(0);
                            return function (t) {
                                return localArc(i(t));
                            };
                        });
                };

                var updateText = function(text){
                    var txt = [];
                    txt.push(text);
                    group.selectAll(".txt")
                        .data(txt)
                        .transition()
                        .ease('cubic-out')
                        .duration(1000)
                        .tween("text", function (d) {
                            var i = d3.interpolate(this.textContent, d);

                            return function (t) {
                                this.textContent = Math.round(i(t));
                            };
                        })
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
            },500);
        }
    };
}]);