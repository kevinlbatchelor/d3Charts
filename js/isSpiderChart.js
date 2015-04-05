
        myApp.directive('isSpiderChart', function ($parse, $window, $filter) {
            return{
                restrict: 'EA',
                scope: {
                    config: '=?',
                    keys: '=?',
                    data: '='
                },

                link: function (scope, elem) {

                    var d3 = $window.d3;

                    var cfg = {
                        showScale: true,
                        radius: 5,
                        w: 600,
                        h: 600,
                        factor: 1,
                        factorLegend: 0.85,
                        levels: 3,
                        maxValue: 0,
                        radians: 2 * Math.PI,
                        opacityArea: 0.5,
                        ToRight: 5,
                        TranslateX: 80,
                        TranslateY: 30,
                        ExtraWidthX: 100,
                        ExtraWidthY: 100,
                        color: d3.scale.category10()
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

                    /*check the objects to insure they are in the key list, then normalize there values*/
                    var setUpData = function () {
                        d = scope.data.map(function (i) {
                            var tempArray = [];

                            angular.forEach(scope.keys, function (keysObject, keyKey) {
                                var tempObj = {};
                                var val = i[keysObject.key] || 0;

                                tempObj.axis = keysObject.label;
                                tempObj.originalValue = (val );
                                tempObj.max = (keysObject.max);
                                tempObj.value = (val / keysObject.max);
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

                    /*setup the basic svg*/
                    var g = d3.select(elem[0])
                        .append("svg")
                        .attr('class', 'isSpiderChart')
                        .attr("width", cfg.w + cfg.ExtraWidthX)
                        .attr("height", cfg.h + cfg.ExtraWidthY)
                        .append("g")
                        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

                    var draw = function () {
                        setUpData();
                        var tooltip;
                        for (var j = 0; j < cfg.levels - 1; j++) {
                            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                            console.log(levelFactor);
                            g.selectAll(".levels")
                                .data([1])
                                .enter()
                                .append("circle")
                                .attr("cx",cfg.h/2)
                                .attr("cy",cfg.w/2)
                                .attr("r", levelFactor)
                                .style("fill","none")
                                .style("stroke", "#ccc")
                                .style("stroke-width", "2")
                                .style("stroke-linecap","round")
                                .style("stroke-dasharray","1,20");
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
                                    .style("font-family", "sans-serif")
                                    .style("font-size", "10px")
                                    .attr("transform", "translate(" + (cfg.w / 2 - levelFactor2 + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor2) + ")")
                                    .attr("fill", "#737373")
                                    .text(format((m + 1) * cfg.maxValue / cfg.levels));
                            }
                        };
                        if(cfg.showScale){
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
                            .style("stroke", "grey")
                            .style("stroke-width", "1px");

                        axis.append("text")
                            .attr("class", "legend")
                            .text(function (d) {
                                return d;
                            })
                            .style("font-family", "sans-serif")
                            .style("font-size", "14px")
                            .attr("text-anchor", "middle")
                            .attr("fill", "#737373")
                            .attr("dy", "1.5em")
                            .attr("transform", function (d, i) {
                                return "translate(0, -10)";
                            })
                            .attr("x", function (d, i) {
                                return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 85 * Math.sin(i * cfg.radians / total);
                            })
                            .attr("y", function (d, i) {
                                return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
                            });

                        /*create the colored polygons that chart area*/
                        var series = 0;
                        var dataValues = [];

                        d.forEach(function(d, i){
                            dataValues = [];
                            g.selectAll(".nodes")
                                .data(d, function(j, i){
                                    dataValues.push([
                                            cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                                            cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                                    ]);
                                });
                            dataValues.push(dataValues[0]);
                            g.selectAll(".area")
                                .data([dataValues])
                                .enter()
                                .append("path")
                                .attr("class", "radar-chart-serie"+series)
                                .style("stroke-width", "2px")
                                .style("stroke", cfg.color(series))
                                .attr("d",function(d) {
                                    var str="";
                                    for(var pti=0;pti<d.length;pti++){
                                        str = str + "250,250 ";
                                    }
                                    return "M" + str;
                                })
                                .style("fill", function(j, i){return cfg.color(series)})
                                .style("fill-opacity", cfg.opacityArea)
                                .on('mouseover', function (d){
                                    z = "path."+d3.select(this).attr("class");
                                    g.selectAll("path")
                                        .transition(200)
                                        .style("fill-opacity", 0.1);
                                    g.selectAll(z)
                                        .transition(200)
                                        .style("fill-opacity", .7);
                                })
                                .on('mouseout', function(){
                                    g.selectAll("path")
                                        .transition(200)
                                        .style("fill-opacity", cfg.opacityArea);
                                })
                                .transition()
                                .delay(i * 1000)
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

                        /*the dots that at the edges of the polygon*/
                        d.forEach(function (y, x) {
                            g.selectAll(".nodes")
                                .data(y).enter()
                                .append("svg:circle")
                                .attr("class", "area" + series)
                                .attr('r', cfg.radius)
                                .attr("alt", function (j) {
                                    return Math.max(j.value, 0);
                                })
                                .attr("cx", function (j, i) {
                                    dataValues.push([
                                            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                                            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                                    ]);
                                    return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                                })
                                .attr("cy", function (j, i) {
                                    return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                                })
                                .attr("data-id", function (j) {
                                    return j.axis;
                                })
                                .style("fill", cfg.color(series)).style("fill-opacity", 0.9)
                                .on('mouseover', function (d) {
                                    var newX = parseFloat(d3.select(this).attr('cx')) - 10;
                                    var newY = parseFloat(d3.select(this).attr('cy')) - 5;

                                    tooltip
                                        .attr('x', newX)
                                        .attr('y', newY)
//                                            .text(format(d.value))
                                        .text(d.originalValue)
                                        .transition(200)
                                        .style('opacity', 1);

                                    z = "polygon." + d3.select(this).attr("class");
                                    g.selectAll("polygon")
                                        .transition(200)
                                        .style("fill-opacity", 0.1);
                                    g.selectAll(z)
                                        .transition(200)
                                        .style("fill-opacity", 0.7);
                                })
                                .on('mouseout', function () {
                                    tooltip
                                        .transition(200)
                                        .style('opacity', 0);
                                    g.selectAll("polygon")
                                        .transition(200)
                                        .style("fill-opacity", cfg.opacityArea);
                                })
                                .append("svg:title")
                                .text(function (j) {
                                    return Math.max(j.value, 0);
                                });

                            series++;
                        });
                        //Tooltip
                        tooltip = g.append('text')
                            .style('opacity', 0)
                            .style('font-family', 'sans-serif')
                            .style('font-size', '13px');

                    };

                    scope.$watch('data', function () {
                        draw();
                    }, true);
                }
            };
        });


