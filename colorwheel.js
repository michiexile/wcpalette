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
	.attr('name', r['PIGMENT - C.I. NAME'])
	.text(r['PAINT - MARKETING NAME'] +": "+ r['MANUFACTURER'] +" "+ r['CODE']);
}
function deselected(e) {
    var target = e.target;
    var ul = document.getElementById('selectedcolors');
    while(target && target.parentNode !== ul) {
	target = target.parentNode;
	if(!target) { return; }
    }
    if(e.target.tagName === 'LI') {
	clickid = e.target.id;
	
    }
}
function setupSelector(err, d) {
    opts = d3.select('#colorselect')
	.selectAll('option')
	.data(hpdata)
        .enter()
	.append('option')
	.attr('label', function(r) {return r['PIGMENT - C.I. NAME'];})
        .text(function(r) {return r['PAINT - MARKETING NAME'] +": "+ r['MANUFACTURER'] +" "+ r['CODE']; });
    d3.select('#colorselect').onchange = selected;
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

  d3.select('#colorwheel').append('p').text('Draw').onclick = drawSelected;
}

var pts;
function drawSelected() {
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
    .style('fill', function(d) { return d3.hsl(d.HA, 1.0, d.VR/100.0).toString(); });
  console.log('clicked');
}

function myOnload() {
    console.log('myOnload')
    setupSVG();
    d3.tsv('hpraw.csv')
	.row(function(d) { hpdata.push(d); })
	.get(function(e, rs) { setupSelector(); });
    //setupSelector();
}
window.onload = myOnload;
