var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2 - 30;

var hpdata = new Array();

var opts;
function selected(e) {
    console.log(e)
    var seli = d3.select('#colorselect').node().selectedIndex;
    var r = hpdata[seli];
    d3.select('#selectedcolors')
	.append('li')
	.attr('name', r['IDX'])
	.text(r['PAINT - MARKETING NAME'] +": "+ r['MANUFACTURER'] +" "+ r['CODE']);
}
function setupSelector(err, d) {
    opts = d3.select('#colorselect')
	.selectAll('option')
	.data(hpdata)
	.append('option')
	.attr('label', function(r) {return r['IDX'];})
        .text(function(r) {return r['PAINT - MARKETING NAME'] +": "+ r['MANUFACTURER'] +" "+ r['CODE']; });
    drawSelected();
}
function resort(condition) {
    opts.order(function(a,b){return d3.ascending(a[condition], b[condition]);});
}
var r = d3.scale.linear()
  .domain([0, 100])
  .range([0, radius]);

var svg, gr;
function setupSVG() {
  svg = d3.select('#colorwheel')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

  gr = svg.append('g')
    .attr('class', 'r axis')
    .selectAll('g')
    .data(r.ticks(5).slice(1))
    .enter().append('g');

  gr.append('circle')
    .attr('r', r);
}

var pts;
function drawSelected() {
    var sels = d3.select('#colorselect').node().selectedOptions;
    var fillopacity;
    if(sels.length > 0) {
	fillopacity = function(d) { 
	    var opaque = false;
	    for(i=0; i<sels.length; i++) {
		if(sels[i].label == d.IDX) {
		    opaque = true;
		}
	    }
	    return opaque?1.0:0.1;
	};
    } else {
	fillopacity = 1.0;
    }
    svg.selectAll('.colpts').remove();
    pts = svg.append('g')
	.attr('class', 'colpts')
	.selectAll('g')
	.data(hpdata)
	.enter()
	.append('g');
    pts.append('circle')
	.attr('r', 2)
	.attr('cx', function (d) { return Math.cos(d.HA*2*Math.PI/360)*d.VR; })
	.attr('cy', function (d) { return Math.sin(d.HA*2*Math.PI/360)*d.VR; })
	.attr('id', function (d) { return "circle" + d.IDX; })
	.attr('fill', function(d) { return d3.hsl(d.HA, 1.0, d.VR/100.0).toString(); })
	.attr('opacity', fillopacity);
}

function myOnload() {
    console.log('myOnload')
    setupSVG();
    d3.tsv('hp.csv')
	.row(function(d) { hpdata.push(d); })
	.get(function(e, rs) { setupSelector(); });
}
window.onload = myOnload;
