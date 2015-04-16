myApp.directive('isSpiderChart', function ($parse, $window, $timeout) {
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

                var cfg = {
                    showScale: true,
                    dotRadius: 5,
                    w: 300,
                    h: 300,
                    factor: 1,
                    factorLegend: 1,
                    levels: 3,
                    maxValue: 0,
                    radians: 2 * Math.PI,
                    opacityArea: 0.3,
                    color: '#9FD200',
                    colorTwo: '#8BD200',
                    colorThree: '#666'
                };

                if ('undefined' !== typeof scope.config) {
                    for (var i in scope.config) {
                        if ('undefined' !== typeof scope.config[i]) {
                            cfg[i] = scope.config[i];
                        }
                    }
                }

                var d;
                var total;
                var radius;
                var format;
                var allAxis;
                var levelFactor2;
                var fontHeight = 16;


                /*check the objects to insure they are in the key list, then normalize there values*/
                var setUpData = function () {
                    d = scope.data.map(function (i) {
                        var tempArray = [];

                        angular.forEach(scope.keys, function (keysObject, keyKey) {
                            var tempObj = {};
                            var val = i[keysObject.key] || 0;

                            tempObj.axis = keysObject.label;
                            tempObj.originalValue = (val);
                            tempObj.max = (keysObject.total);
                            tempObj.value = (val / keysObject.total);
                            tempObj.label = (keysObject.label);
                            tempArray.push(tempObj);
                        });

                        return tempArray;
                    });

                    /*returns largest value*/
                    cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) {
                        return d3.max(i.map(function (o) {
                            return o.value;
                        }));
                    }));

                    /*returns array of axis labels*/
                    allAxis = (d[0].map(function (i, j) {
                        return i.label;
                    }));

                    total = allAxis.length;
                    radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
                    format = d3.format('%');
                    d3.select(".isSpiderChart").select("svg").remove();
                };

                /*keep things square*/
                var size = Math.min(elem[0].offsetWidth, elem[0].offsetHeight) - (cfg.dotRadius * 2);
                cfg.w = size;
                cfg.h = size;

                /*TODO need to fix if there is no height*/

                /*setup the basic svg*/
                var g = d3.select(elem[0])
                    .append("svg")
                    .attr('class', 'isSpiderChart')
                    .attr("width", elem[0].offsetWidth)
                    .attr("height", elem[0].offsetHeight)
                    .append("g")
                    .attr('transform', 'translate(83,10)');

                var draw = function () {
                    setUpData();
                    var tooltip;

                    /*the circles*/
                    for (var j = 0; j < cfg.levels - 1; j++) {
                        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                        g.selectAll(".levels")
                            .data([1])
                            .enter()
                            .append("circle")
                            .attr("cx", cfg.w / 2)
                            .attr("cy", cfg.h / 2)
                            .attr("r", levelFactor)
                            .style("fill", "none")
                            .style("stroke", "#ccc")
                            .style("stroke-width", "3")
                            .style("stroke-linecap", "round")
                            .style("stroke-dasharray", ".1,17");
                    }

                    /*Text indicating at what % each level is*/
                    var showScaleText = function () {

                        var xPoint = function () {
                            return  function (d) {
                                return levelFactor2 * (1 - cfg.factor * Math.sin(0));
                            };
                        };

                        var yPoint = function () {
                            return function (d) {
                                return levelFactor2 * (1 - cfg.factor * Math.cos(0));
                            };
                        };
                        for (var m = 0; m < cfg.levels; m++) {
                            levelFactor2 = cfg.factor * radius * ((m + 1) / cfg.levels);
                            g.selectAll(".levels")
                                .data([1]) //dummy data
                                .enter()
                                .append("svg:text")
                                .attr("x", xPoint())
                                .attr("y", yPoint())
                                .attr("class", "legend")
                                .style("font-size", "10px")
                                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor2 ) + ", " + (cfg.h / 2 - levelFactor2) + ")")
                                .attr("fill", cfg.colorTwo)
                                .text(format((m + 1) * cfg.maxValue / cfg.levels));
                        }
                    };
                    if (cfg.showScale) {
                        showScaleText();
                    }

                    /*create the lines that radiate from center*/
                    var axis = g.selectAll(".axis")
                        .data(allAxis)
                        .enter()
                        .append("g")
                        .attr("class", "axis");

                    axis.append("line")
                        .attr("x1", cfg.w / 2)
                        .attr("y1", cfg.h / 2)
                        .attr("x2", function (d, i) {
                            return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                        })
                        .attr("y2", function (d, i) {
                            return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                        })
                        .attr("class", "line")
                        .style("stroke", "#CCC")
                        .style("stroke-width", "1");

                    axis.append("text")
                        .attr("class", "legend")
                        .text(function (d) {
                            return d;
                        })
                        .attr("fill", cfg.colorThree)
                        .attr("text-anchor", "left")
                        .attr("dy", "1.5em")
                        .attr("transform", function () {
                            return "translate(0, 0)";
                        })
                        .attr("x", function (d, i) {
//                                    console.log(this.getComputedTextLength());
                            return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - Math.sin(i * cfg.radians / total);
                        })
                        .attr("y", function (d, i) {
                            return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - Math.cos(i * -cfg.radians / total);
                        });

                    /*create the colored polygons that chart area*/
                    var series = 0;
                    var dataValues = [];

                    d.forEach(function (d, seriesI) {
                        dataValues = [];
                        g.selectAll(".nodes")
                            .data(d, function (j, i) {
                                dataValues.push([
                                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                                ]);
                            });
                        dataValues.push(dataValues[0]);
                        g.selectAll(".area")
                            .data([dataValues])
                            .enter()
                            .append("path")
                            .attr("class", "radarChartSeries" + series)
                            .style("stroke-width", "0")
                            .style("stroke", cfg.color)
                            .attr("d", function (d) {
                                var str = "";
                                for (var pti = 0; pti < d.length; pti++) {
                                    str = str + "250,250 ";
                                    /* TODO this needs to change to fix the polygon so it emanates from the center*/
                                }
                                return "M" + str;
                            })
                            .style("fill", function (j, i) {
                                return cfg.color;
                            })
                            .style("fill-opacity", cfg.opacityArea)
                            .on('mouseover', function () {
                                g.selectAll(".radarChartSeries" + seriesI)
                                    .transition(200)
                                    .style("fill-opacity", 0.60);
                                g.selectAll(z)
                                    .transition(200)
                                    .style("fill-opacity", 0.3);
                            })
                            .on('mouseout', function () {
                                g.selectAll(".radarChartSeries" + seriesI)
                                    .transition(200)
                                    .style("fill-opacity", cfg.opacityArea);
                            })
                            .transition()
                            .delay(seriesI * 1000)
                            .ease("bounce")
                            .duration(1000)
                            .attr("d", function (d) {
                                var str = "";
                                for (var pti = 0; pti < d.length; pti++) {
                                    str = str + d[pti][0] + "," + d[pti][1] + " ";
                                }
                                return "M" + str;

                            });
                        series++;
                    });

                    series = 0;

                    var sinVal = function (j, i) {
                        return cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                    };
                    var cosVal = function (j, i) {
                        return cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                    };

                    /*the dots that at the edges of the polygon*/
                    d.forEach(function (forD, forI) {
                        var corners = g.selectAll(".nodes")
                            .data(forD).enter();

                        var textWidth = [];


                        corners.append("svg:circle")
                            .attr("class", "dotSeries" + series)
                            .attr('r', cfg.dotRadius)
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
                            .style("fill", cfg.color).style("fill-opacity", 0.9)

                            .on('mouseover', function (onD, onI) {
                                var paddingR = 10;
                                var widthOfBox = textWidth[onI].width + paddingR;

                                var placement = function (placeD, placeI) {
                                    var bubbleRight = " 0,50 12,-10 " + widthOfBox + ",0 0,-40 z";
                                    var bubbleLeft = " 0,50 -12,-10 -" + widthOfBox + ",0 0,-40 z";
                                    var bubbleDownRight = " 0,50, " + (widthOfBox + paddingR)+ ",0 0,-40, -38,0 z";
                                    var bubbleDownLeft = " 0,50, -50,0 0,-40, " + widthOfBox + ",0 z";
                                    var bubVal = bubbleRight;
                                    var modY = -55;
                                    var x = sinVal(placeD, placeI);
                                    var y = cosVal(placeD, placeI);

                                    var paddingL = 0;
                                    var paddingT = 10;

                                    if (x > cfg.w - widthOfBox) {
                                        paddingL = -widthOfBox - paddingR;
                                        bubVal = bubbleLeft;
                                    } else if (y < 50) {
                                        modY = 5;
                                        paddingT = 18;
                                        bubVal = bubbleDownRight;
                                    } else if ((y < 50) && (x > cfg.w - widthOfBox)) {
                                        modY = 5;
                                        bubVal = bubbleDownLeft;
                                    }

                                    return  {
                                        m: "m" + x + "," + (y + modY ) + bubVal,
                                        x: x + 10 + paddingL,
                                        y: y + modY + fontHeight + paddingT
                                    };
                                };

                                g.selectAll(".callText" + onI + forI)
                                    .attr('x', placement(onD, onI).x)
                                    .attr('y', placement(onD, onI).y)
                                    .transition(200)
                                    .style("display", 'block');

                                g.selectAll(".callOut" + onI + forI)
                                    .attr("d", function () {
                                        return placement(onD, onI).m;
                                    })
                                    .transition(200)
                                    .style("display", 'block');
                            })
                            .on('mouseout', function (d, i) {

                                g.selectAll(".callText" + i + forI)
                                    .transition(200)
                                    .style("display", 'none');

                                g.selectAll(".callOut" + i + forI)
                                    .transition(200)
                                    .style("display", 'none');
                            });

                        /*The text bubbles at each data point*/
                        corners.append('g')
                            .append('path')
                            .attr('class', function (d, i) {
                                return "callOut" + i + forI + " " + "callOutSeries" + forI;
                            })
//                            .style('display', 'none')
                            .style("fill", cfg.colorTwo)
                        ;
                        /*the text in the bubbles*/
                        corners.append('text')
                            .text('i')
                            .attr('class', function (d, i) {
                                return "callText" + i + forI + " " + "callTextSeries" + forI;
                            })
                            .text(function (a, b) {
                                return a.originalValue;
                            })
                            .attr('x', function (a, b) {
                                return sinVal(a, b);
                            })
                            .attr('y', function (a, b) {
                                textWidth.push(this.getBBox());
                                return cosVal(a, b);
                            })
                            .style('display', 'none')
                            .style('fill', '#fff')
                            .style('font-weight', 'bold');

                        series++;
                    });
                };

                scope.$watch('data', function () {
                    draw();
                }, true);
            }, 50);
        }
    };
});

