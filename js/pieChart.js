var data = _.map(_.range(10), function (i) {
    return 1;
});

var colorScale = d3.scale.linear()
    .domain([0, data.length])
    .range(['#002640', '#0099FF']);

var canvas = d3.select('#pie').append('svg')
    .attr('width', 400)
    .attr('height', 300);

var group = canvas.append('g')
    .attr('transform', 'translate(200,150)');

var arc = d3.svg.arc()
    .innerRadius(120)
    .outerRadius(150);

var pie = d3.layout.pie()
    .value(function (d) {
        return d
    });

group.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc')
    .append('path')
    .attr("d", arc)
    .attr('width', 50)
    .attr("height", 0)
    .transition()
    .delay(function (d, i) {
        return i * 100;
    })
    .attr('height', 1)
    .attr('fill', function (d, i) {
        return colorScale(i)
    });
