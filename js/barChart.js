var margin = {top: 20, right: 20, bottom: 20, left: 20};

var w = 400- margin.left-margin.right, h = 300 -margin.top-margin.bottom;

var svg = d3.select('#chartArea').append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var dataset = _.map(_.range(66), function (i) {
    return Math.random() * 15;
});
var mlt = 10;

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset)])
    .range([0, h]);

var xScale = d3.scale.ordinal()
    .domain(dataset)
    .rangeBands([0, w], 0.02, 0);

var colorScale = d3.scale.quantile()
    .domain([0, 10, dataset.length - 10, dataset.length])
    .range(['#002640', '#004C7F', '#0072BF', '#0099FF']);

var pie = d3.layout.pie()
    .value(function(d){
        return d
    });

svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d, i) {
        return xScale(d);
    })
    .attr('y', function (d) {
        return h - yScale(d);
    })
    .attr('width', xScale.rangeBand())
    .attr('height', yScale)
    .attr('fill', function (d, i) {
        return colorScale(i)
    });

