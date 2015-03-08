//var data = [12,14,14,15,16];

var data = _.map(_.range(10), function (i) {
    return 1;
});

var r = 150;
var canvas =  d3.select('body').append('svg')
    .attr('width', 600)
    .attr('height',600);

var  group = canvas.append('g')
    .attr('transform', 'translate(300,300)');



var arc = d3.svg.arc()
    .innerRadius(50)
    .outerRadius(r);

var pie = d3.layout.pie()
    .value(function(d){
        return d
    });
 group.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc')
    .append('path')
    .attr("d", arc)
     .attr('width', 100)
     .attr('height', 50)
     .attr('fill', 'red')
     ;
