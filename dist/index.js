// set the dimensions and margins of the graph
const props = ["RAM- minne", "Flash/SSD-størrelse", "Prosessorhastighet", "Grafikkminne"];

var iwidth = window.innerWidth / 2.0 - 100;
var iheight = iwidth;

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = iwidth - margin.left - margin.right - 100,
    height = iheight  - margin.top - margin.bottom - 100;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.json("out.json", function(data) {

  // Add X axis
  let xmin = 1.0e20;
  let xmax = -1.0e20;
  let ymin = 1.0e20;
  let ymax = -1.0e20;
  for (let x of data) {
    xmin = Math.min(xmin, x.svdx);
    xmax = Math.max(xmax, x.svdx);
    ymin = Math.min(ymin, x.svdy);
    ymax = Math.max(ymax, x.svdy);
  }

  var x = d3.scaleLinear()
    .domain([xmin, xmax])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-1, 1])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])


  // Highlight the specie that is hovered
  var highlight = function(d){

    const tdata = d.infodict;
    const heading = '<h1>' + d.name + '</h1>';
    let table = [];
    for (key in tdata) {
      const col1 = '<td>' + key + '</td>';
      const col2 = '<td>' + tdata[key] + '</td>';
      const tr = '<tr>' + col1 + col2 + '</tr>';
      table.push(tr);
    }
    table = '<table>' + table.join('') + '</table>';
    let i = 0;
    const indices = [];
    for (let cmp of data) {
      v1 = cmp.vector;
      v2 = d.vector;
      let e = 0.0;
      for (let i = 0; i < v1.length; i++) {
        const dx = v2[i] - v1[i];
        e += dx * dx;
      }
      e = Math.sqrt(e);
      indices.push([i, e]);
      i++;
    }
    indices.sort((a, b) => a[1] - b[1]);
    const list = [];
    for (let i = 0; i <= 10; i++) {
      list.push(data[indices[i][0]]);
    }
    const ctable = [];
    for (let i = 0; i <= 10; i++) {
      const cols = [];
      //for (key in list[i].numdict) {
      for (key of props) {
        //const col1 = '<td>' + key + '</td>';
        const col2 = '<td><b>' + key + ':</b>' + list[i].infodict[key] + '</td>';
        cols.push(col2);
      }
      const tr = '<tr><td>D: ' + indices[i][1] + '</td><td>' + list[i].name + '</td>: ' + cols.join(' ') + '</tr>';
      ctable.push(tr);
    }
    const cmptable = '<table>' + ctable.join('') + '</table>';
    $("#divdum").html(heading + cmptable + table);
    /*
    selected_specie = d.Species

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 3)

    d3.selectAll("." + selected_specie)
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 7)
      */
  };

  // Highlight the specie that is hovered
  var doNotHighlight = function(){
    /*
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 5 )
      */
  };

  // Add dots
  const g = svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("g");
  g.append("circle")
      .attr("class", function (d) { return "dot"} )
      .attr("cx", function (d) { return x(d.svdx); } )
      .attr("cy", function (d) { return y(d.svdy); } )
      .attr("r", 5)
      //.style("fill", function (d) { return color(0); } )
      .style("fill", "none")
      .style("stroke", "blue")
      .style("stroke-opacity", "1.0")
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight );
  let colors = ["red", "blue", "green", "purple"];
  let i = 0;
  for (prop of props) {
    g.append("circle")
        .attr("class", function (d) { return "dot"} )
        .attr("cx", function (d) { return x(d.svdx); } )
        .attr("cy", function (d) { return y(d.svdy); } )
        .attr("r", function (d) { return prop in d.scalednumdict ? 10.0 * d.scalednumdict[prop] : 0.0; } )
        //.style("fill", function (d) { return color(d.numdict[prop]); } )
        .style("fill", function (d) { return colors[i]; } )
        .style("opacity", function (d) { return 0.2; } )
    i++;
  }
  /*
  g.append("text")
      .style("font-size", "10px")
      .text(function (d) { return d.name; } )
      .attr("x", function (d) { return x(d.svdx); } )
      .attr("y", function (d) { return y(d.svdy); } )
      */

});
