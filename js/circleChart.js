var items = 360

var margin = {top: 0, right: 0, bottom: 0, left: 0};

var w = 400 - margin.left - margin.right, h = 300 - margin.top - margin.bottom;

var svg = d3.select('#cirBar').append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + '200, ' + margin.top + '150)');


var dataset = _.map(_.range(items), function (i) {
    if (i % 3 == 0) {
        return 60
    }
    else {
        return 0;
    }

});

var colorScale = d3.scale.linear()
    .domain([0, dataset.length])
    .range(['#002640', '#0099FF']);

svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', 80)
    .attr('width', 1)
    .attr("height", 0)
    .transition()
    .delay(function (d, i) {
        return i * 10;
    })
    .attr('height', function (d) {
        return d
    })
    .attr('fill', function (d, i) {
        return colorScale(i)
    })
    .attr('transform', function (d, i) {
        return 'rotate(' + i + ')'
    })
;

