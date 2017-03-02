import {
  brush,
  select,
  scaleLinear,
  scaleTime,
  extent,
  randomNormal,
  brushX,
  axisBottom,
  arc,
  event,
  selectAll
} from 'd3'

class YearRange {
  constructor(svgWidth = 1600, svgHeight = 80) {
    this.svg = select('body').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)

    const margin = {top: 20, right: 50, bottom: 20, left: 50}
    const width = +this.svg.attr("width") - margin.left - margin.right
    const height = +this.svg.attr("height") - margin.top - margin.bottom

    this.g = this.svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    this.x = scaleTime()
      .domain([new Date(1970, 1, 1), new Date(2015, 1, 1)])
      .rangeRound([0, width])
    this.y = randomNormal(height / 2, height / 8)

    const brush = brushX()
      .extent([[0, 0], [width, height]])
      .on("start brush end", () => this.brushMoved(height));

    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0, ${height})`)
      .call(axisBottom(this.x));

    this.gBrush = this.g.append("g")
      .attr("class", "brush")
      .call(brush);

    this.handle = this.gBrush.selectAll(".handle--custom")
      .data([{type: "w"}, {type: "e"}])
      .enter().append("path")
      .attr("class", "handle--custom")
      .attr("fill", "#666")
      .attr("fill-opacity", 0.8)
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("cursor", "ew-resize")
      .attr("d", arc()
        .innerRadius(0)
        .outerRadius(height / 2)
        .startAngle(0)
        .endAngle((d, i) => i ? Math.PI : -Math.PI ));

    this.gBrush.call(brush.move, [0.3, 0.5].map(this.x));
  }

  brushMoved(height, brush) {
    const s = event.selection;
    console.log(s)
    if (s === null) {
      this.handle.attr("display", "none"); //Hide handles if no range
      //circle.classed("active", false);
    } else {
      //const sx = s.map(this.x.invert);
      //circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });

      this.handle.attr("display", null)
        .attr("transform", (d, i) => `translate(${s[i]}, ${height / 2})` );
    }
  }
}

export default YearRange
