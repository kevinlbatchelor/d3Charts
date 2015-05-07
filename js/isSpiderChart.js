myApp.directive('spiderChart', function ($parse, $window, $timeout) {
    return{
        restrict: 'EA',
        scope: {
            config: '=?',
            keys: '=?',
            data: '='
        },

        link: function (scope, elem) {
            $timeout(function () {

                var d3 = $window.d3;

                scope.cfg = {
                    showScale: true,
                    dotRadius: 5,
                    w: 300,
                    h: 300,
                    levels: 3,
                    maxValue: 0,
                    radians: 2 * Math.PI,
                    opacityArea: 0.3,
                    colors: ['#666'],
                    lineColor: '#666'
                };

                angular.extend(scope.cfg, scope.config);

                var formattedData;
                var total;
                var radius;
                var format;
                var allAxis;
                var fontHeight = 16;
                var crazyAdjuster = 50;
                var series = 0;
                var svg, g, size;
                scope.textWidth = [];
                scope.w = elem[0].offsetWidth;
                scope.h = elem[0].offsetHeight;

                scope.fade = d3.scale.quantile();
                if (scope.cfg.colors.length === 2) {
                    scope.fade = d3.scale.linear();
                }

                /*check the objects to insure they are in the key list, then normalize there values*/
                var setUpData = function () {
                    formattedData = scope.data.map(function (i) {
                        var tempArray = [];

                        angular.forEach(scope.keys, function (dObject) {
                            var tempObj = {};
                            var val = i[dObject.key] || 0;

                            tempObj.axis = dObject.label;
                            tempObj.originalValue = (val);
                            tempObj.max = (dObject.total);
                            tempObj.value = (val / dObject.total);
                            tempObj.label = (dObject.label);
                            tempArray.push(tempObj);
                        });

                        return tempArray;
                    });

                    /*returns largest value*/
                    scope.cfg.maxValue = Math.max(scope.cfg.maxValue, d3.max(formattedData, function (i) {
                        return d3.max(i.map(function (o) {
                            return o.value;
                        }));
                    }));

                    /*returns array of axis labels*/
                    allAxis = (formattedData[0].map(function (i, j) {
                        return i.label;
                    }));

                    total = allAxis.length;
                    radius = Math.min(scope.cfg.w / 2, size / 2);
                    format = d3.format('%');
                };

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
                    sizeSvg();
                    baseSvg();
                    draw();
                };

                var sizeSvg = function () {
                    size = Math.min(scope.w, scope.h) - ((scope.cfg.dotRadius * 2) + (crazyAdjuster));

                    scope.svgW = scope.w;
                    scope.svgH = scope.h;
                };

                var removeSvg = function () {
                    d3.select(elem[0]).select("svg").remove();
                };

                /*setup the basic svg*/
                var baseSvg = function () {
                    svg = d3.select(elem[0])
                        .append("svg")
                        .attr('class', 'isSpiderChartSVG')
                        .attr("width", scope.svgW)
                        .attr("height", scope.svgH);
                    g = svg.append("g")
                        .attr('transform', 'translate(' + (scope.svgW - size) / 2 + ',' + ((scope.svgH) - (size)) / 2 + ')');
                };

                /*functions used for finding the corners of polygons*/
                var sinVal = function (j, i) {
                    return size / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / scope.cfg.maxValue) * Math.sin(i * scope.cfg.radians / total));
                };
                var cosVal = function (j, i) {
                    return size / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / scope.cfg.maxValue) * Math.cos(i * scope.cfg.radians / total));
                };

                /*functions used for mapping coordinate data into an array*/
                var mapData = function (data) {
                    return data.map(function (j, i) {
                        return [sinVal(j, i), cosVal(j, i)];
                    });
                };

                /*creates an svg path attribute*/
                var pathCreator = function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return "M" + str + "z";
                };

                scope.fadeShape = function (series) {
                    return function () {
                        g.selectAll(".radarChartSeries" + series)
                            .transition(200)
                            .style("fill-opacity", 0.60);
                    };
                };

                scope.fadeShapeOut = function (series) {
                    return function () {
                        g.selectAll(".radarChartSeries" + series)
                            .transition(200)
                            .style("fill-opacity", scope.cfg.opacityArea);
                    };
                };

                var draw = function () {
                    setUpData();

                    var colorScale = scope.fade.domain([0, scope.keys.length])
                        .range(scope.cfg.colors);

                    /*the circles*/
                    for (var j = 0; j < scope.cfg.levels - 1; j++) {
                        var levelFactor = radius * ((j + 1) / scope.cfg.levels);
                        g.selectAll(".levels")
                            .data([1])
                            .enter()
                            .append("circle")
                            .attr("cx", size / 2)
                            .attr("cy", size / 2)
                            .attr("r", levelFactor)
                            .style("fill", "none")
                            .style("stroke", "#ccc")
                            .style("stroke-width", "3")
                            .style("stroke-linecap", "round")
                            .style("stroke-dasharray", ".1,17")
                        ;
                    }

                    /*text indicating at what % each level is*/
                    var showScaleText = function () {
                        var levelFactor;
                        var xPoint = function () {
                            return  function (d) {
                                return levelFactor * (1 - Math.sin(0));
                            };
                        };

                        var yPoint = function () {
                            return function (d) {
                                return levelFactor * (1 - Math.cos(0));
                            };
                        };
                        for (var m = 0; m < scope.cfg.levels; m++) {
                            levelFactor = radius * ((m + 1) / scope.cfg.levels);
                            g.selectAll(".legend" + m).remove();
                            g.selectAll(".levels")
                                .data([1]) //dummy data
                                .enter()
                                .append("svg:text")
                                .attr("x", xPoint())
                                .attr("y", yPoint())
                                .attr("class", "legend" + m)
                                .style("font-size", "10px")
                                .attr("transform", "translate(" + (size / 2 - levelFactor ) + ", " + ((size ) / 2 - levelFactor) + ")")
                                .attr("fill", scope.cfg.lineColor)
                                .text(format((m + 1) * scope.cfg.maxValue / scope.cfg.levels));
                        }
                    };

                    /*only show scale if user turns in on*/
                    if (scope.cfg.showScale) {
                        showScaleText();
                    }

                    /*create the lines that radiate from center*/
                    var axis = g.selectAll(".axis")
                        .data(allAxis)
                        .enter()
                        .append("g")
                        .attr("class", "axis");

                    axis.append("line")
                        .attr("x1", size / 2)
                        .attr("y1", size / 2)
                        .attr("x2", function (d, i) {
                            return size / 2 * (1 - Math.sin(i * scope.cfg.radians / total));
                        })
                        .attr("y2", function (d, i) {
                            return size / 2 * (1 - Math.cos(i * scope.cfg.radians / total));
                        })
                        .attr("transform", "translate(0," + 0 + ")")
                        .attr("class", "line")
                        .style("stroke", "#CCC")
                        .style("stroke-width", "1");

                    /*create the labels at for the series*/
                    var labelX = function (d, i) {
                        return (size) / 2 * (1 - Math.sin(i * scope.cfg.radians / total)) - Math.sin(i * scope.cfg.radians / total);
                    };

                    var labelY = function (d, i) {
                        return (size) / 2 * (1 - Math.cos(i * scope.cfg.radians / total)) - Math.cos(i * -scope.cfg.radians / total);
                    };

                    svg.selectAll(".group").remove();
                    var legendGroup = svg.append("g").attr("class", "group");

                    legendGroup.selectAll(".legend")
                        .data(allAxis)
                        .enter()
                        .append("text")
                        .attr("class", function (d, i) {
                            return "legend" + i;
                        })
                        .text(function (d) {
                            return d;
                        })
                        .attr("fill", scope.cfg.lineColor)
                        .attr("text-anchor", function (d, i) {
                            var pos = "middle";
                            if (labelX(d, i) > size / 2 + 1) {
                                pos = 'start';
                            } else if (labelX(d, i) < size / 2 - 1) {
                                pos = 'end';
                            }
                            return pos;
                        })
                        .attr("transform", function (d, i) {
                            var translate = (scope.svgW - size) / 2 + ',' + ((scope.svgH) - (size)) / 2;
                            if (labelY(d, i) > size - 1) {
                                translate = (scope.svgW - size) / 2 + ',' + ((scope.svgH) - (size - 25)) / 2;
                            } else if (labelY(d, i) < 5 && labelY(d, i) > -5) {
                                translate = (scope.svgW - size) / 2 + ',' + ((scope.svgH) - (size + 25)) / 2;
                            }
                            return 'translate(' + translate + ')';
                        })
                        .attr("x", function (d, i) {
                            return labelX(d, i);
                        })
                        .attr("y", function (d, i) {
                            return labelY(d, i);
                        });

                    /*create the colored polygons that chart area*/
                    formattedData.forEach(function (seriesD, seriesI) {
                        g.selectAll(".radarChartSeries" + seriesI).remove();
                        g.selectAll(".radarChartSeries" + seriesI)
                            .data([mapData(seriesD)])
                            .enter()
                            .append("path")
                            .attr("class", "radarChartSeries" + seriesI)
                            .style("stroke-width", "0")
                            .style("stroke", function () {
                                return colorScale(seriesI);
                            })
                            .attr("d", function (d) {
                                var str = "";
                                for (var pti = 0; pti < d.length; pti++) {
                                    str = str + (size / 2) + "," + (size / 2) + " ";
                                }
                                return "M" + str;
                            })
                            .style("fill", function (j, i) {
                                return colorScale(seriesI);
                            })
                            .style("fill-opacity", scope.cfg.opacityArea)
                            .on('mouseover', scope.fadeShape(seriesI))
                            .on('mouseout', scope.fadeShapeOut(seriesI))
                            .transition()
                            .delay(seriesI * 1000)
                            .ease("bounce")
                            .duration(1000)
                            .attr("d", pathCreator);
                        series++;
                    });

                    series = 0;

                    scope.fadeInToolTips = function (forD, forI) {
                        return function (onD, onI) {
                            var paddingR = 10;
                            var widthOfBox = scope.textWidth[onI + (forI * scope.keys.length)].width + paddingR;

                            var placement = function (placeD, placeI) {
                                var bubbleRight = " 0,50 12,-10 " + widthOfBox + ",0 0,-40 z";
                                var bubbleLeft = " 0,50 -12,-10 -" + widthOfBox + ",0 0,-40 z";
                                var bubbleDownRight = " 0,50, " + (widthOfBox + paddingR) + ",0 0,-40, " + (-1 * widthOfBox) + ",0 z";

                                scope.bubVal = bubbleRight;
                                var modY = -55;
                                var x = sinVal(placeD, placeI);
                                var y = cosVal(placeD, placeI);

                                var paddingL = 0;
                                var paddingT = 10;

                                if (x * 0.8333 > (size - widthOfBox)) {
                                    paddingL = -widthOfBox - paddingR;
                                    scope.bubVal = bubbleLeft;
                                } else if (y < 50) {
                                    modY = 5;
                                    paddingT = 18;
                                    scope.bubVal = bubbleDownRight;
                                }

                                return  {
                                    m: "m" + x + "," + (y + modY ) + scope.bubVal,
                                    x: x + 10 + paddingL,
                                    y: y + modY + fontHeight + paddingT
                                };
                            };

                            g.selectAll(".callText" + onI + forI)
                                .attr('x', placement(onD, onI).x)
                                .attr('y', placement(onD, onI).y)
                                .transition(200)
                                .style("display", 'block')
                                .style('fill', '#fff')
                                .style('fill-opacity', 1)
                                .style('font-weight', 'bold');

                            g.selectAll(".callOut" + onI + forI)
                                .attr("d", function () {
                                    return placement(onD, onI).m;
                                })
                                .transition(200)
                                .style("display", 'block');
                        };
                    };

                    scope.fadeOutToolTips = function (forD, forI) {
                        return function (d, i) {
                            g.selectAll(".callText" + i + forI)
                                .transition(200)
                                .style("display", 'none');

                            g.selectAll(".callOut" + i + forI)
                                .transition(200)
                                .style("display", 'none');
                        };
                    };

                    /*the dots that at the edges of the polygon*/
                    formattedData.forEach(function (forD, forI) {
                        g.selectAll(".dotSeries" + forI).remove();
                        var corners = g.selectAll(".nodes")
                            .data(forD).enter();

                        corners.append("svg:circle")
                            .attr("class", "dotSeries" + forI)
                            .attr('r', scope.cfg.dotRadius)
                            .attr("alt", function (j) {
                                return Math.max(j.value, 0);
                            })
                            .attr("cx", function (j, i) {
                                return sinVal(j, i);
                            })
                            .attr("cy", function (j, i) {
                                return cosVal(j, i);
                            })
                            .attr("data-id", function (j) {
                                return j.axis;
                            })
                            .style("fill", function () {
                                return colorScale(forI);
                            })
                            .style("fill-opacity", 0.9)
                            .on('mouseover', scope.fadeInToolTips(forD, forI))
                            .on('mouseout', scope.fadeOutToolTips(forD, forI));

                        /*The text bubbles at each data point*/
                        corners.append('g')
                            .append('path')
                            .attr('class', function (d, i) {
                                return "callOut" + i + forI + " " + "callOutSeries" + forI;
                            })
                            .style('display', 'none')
                            .style("fill", function () {
                                return colorScale(forI);
                            })
                        ;
                        /*the text in the bubbles*/
                        corners.append('text')
                            .text('i')
                            .attr('class', function (d, i) {
                                return "callOutText callText" + i + forI + " " + "callTextSeries" + forI;
                            })
                            .text(function (a, b) {
                                return a.originalValue;
                            })
                            .attr('x', function (a, b) {
                                return sinVal(a, b);
                            })
                            .attr('y', function (a, b) {
                                scope.textWidth.push(this.getBBox());
                                return cosVal(a, b);
                            })
                            .style('display', 'none')
                            .style('fill', '#fff')
                            .style('font-weight', 'bold');

                        series++;
                    });
                };

                scope.update = function () {
                    scope.textWidth = [];
                    setUpData();
                    formattedData.forEach(function (reSeriesD, reSeriesI) {
                        g.selectAll(".radarChartSeries" + reSeriesI)
                            .data([mapData(reSeriesD)])
                            .transition()
                            .duration(1000)
                            .attr("d", pathCreator);

                        g.selectAll(".dotSeries" + reSeriesI)
                            .data(reSeriesD)
                            .transition()
                            .duration(1000)
                            .attr("cx", function (j, i) {
                                return sinVal(j, i);
                            })
                            .attr("cy", function (j, i) {
                                return cosVal(j, i);
                            });

                        g.selectAll(".callTextSeries" + reSeriesI)
                            .data(reSeriesD)
                            .style("fill-opacity", 0.01)
                            .transition()
                            .text(function (d) {
                                return d.originalValue;
                            })
                            .style("fill-opacity", 0)
                            .attr('style', 'display: block;')
                            .each("end", function () {
                                scope.textWidth.push(this.getBBox());
                            })
                        ;
                    });
                };

                var firstRun = true;
                scope.$watch('data', function () {
                    if (firstRun) {
                        drawChart();
                        firstRun = false;
                        return;
                    }
                    scope.update();
                }, true);
            }, 50);
        }
    };
});