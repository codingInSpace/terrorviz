import moment from 'moment'
//import store from '../redux/store'
//import * as actions from '../redux/actions'
import {
  brush,
  select,
  scaleLinear,
  scaleTime,
  timeYear,
  extent,
  randomNormal,
  brushX,
  axisBottom,
  arc,
  transition,
  event,
  selectAll
} from 'd3'

class YearRange {
  constructor(svgWidth = 1600, svgHeight = 80, getRange) {
    this.getRange = getRange

    this.svg = select('body').append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)

    const margin = {top: 20, right: 50, bottom: 20, left: 50}
    const { left, right, top, bottom } = margin
    const width = +this.svg.attr("width") - left - right
    const height = +this.svg.attr("height") - top - bottom

    this.g = this.svg.append("g")
      .attr("transform", `translate(${left}, ${top})`);

    this.x = scaleTime()
      .domain([new Date(1970, 1, 1), new Date(2015, 1, 1)])
      .rangeRound([0, width])
    this.y = randomNormal(height / 2, height / 8)

    this.brush = brushX()
      .extent([[0, 0], [width, height]])
      .on("start brush", () => this.brushMoved(height))
      .on("end", () => this.brushEnded(this));

    this.g.append("g")
      .attr("class", "axis axis--grid")
      .attr("transform", `translate(0, ${height})`)
      .call(axisBottom(this.x)
        .ticks(timeYear)
        .tickSize(-height)
        .tickPadding(0))
      .selectAll("text")
        .attr("class", "axis-text")
        .attr("x", 10)
        .attr("y", 4);

    this.gBrush = this.g.append("g")
      .attr("class", "brush")
      .call(this.brush);

    this.handle = this.gBrush.selectAll(".handle--custom")
      .data([{type: "w"}, {type: "e"}])
      .enter().append("path")
      .attr("class", "handle--custom")
      .attr("fill", "#666")
      .attr("fill-opacity", 0.8)
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("cursor", "ew-resize")

    this.gBrush.call(this.brush.move, [0.3, 0.5].map(this.x));
  }

  brushMoved(height) {
    const s = event.selection;
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

  brushEnded(context) {
    if (!event.sourceEvent) return;
    if (!event.selection) return;

    const t0 = event.selection.map(this.x.invert),
      t1 = t0.map(timeYear.round);

    // If empty when rounded, use floor & ceil instead.
    if (t1[0] >= t1[1]) {
      t1[0] = timeYear.floor(t0[0]);
      t1[1] = timeYear.offset(t1[0]);
    }

    const year1 = parseFloat(moment(t1[0]).format('YYYY'))
    const year2 = parseFloat(moment(t1[1]).subtract(1, 'y').format('YYYY'))

    // Move selection to valid spot
    select('.brush').transition().call(event.target.move, t1.map(this.x));

    let data
    if (year1 !== year2)
      data = [year1, year2]
    else
      data = [year1]

    this.getRange(data)
  }
}

export default YearRange
