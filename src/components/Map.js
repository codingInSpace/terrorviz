import * as topojson from 'topojson'
import {
  geoMercator,
  select,
  geoPath,
  zoom,
  json,
  event
} from 'd3'

/**
 * Main map class
 */
class Map {

  constructor(width = 1600, height = 800) {
    this.projection = geoMercator()
      .scale((width - 3) / (2 * Math.PI))
      .translate([width / 2, height / 1.75]);

    this.svg = select("body").append("svg")
      .attr("width", width)
      .attr("height", height);
    //.style("background-color", "black");

    this.path = geoPath()
      .projection(this.projection);

    this.g = this.svg.append("g");

    this.tooltip = select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    this.zoomBehavior = zoom()
        .scaleExtent([1, 100])
      .on('zoom', this.zoomed)
  }

  zoomed() {
    const { x, y, k } = event.transform  // event.transform.x, event.transform.y etc
    select('body').select('svg').select('g')
      .attr('transform', `translate(${x}, ${y}) scale(${k})`)
  }

  draw(data) {
    json('public/data/world-110m2.json', (error, topology) => {
      if (error) return console.error(error)

      this.g.selectAll("path")
        .data(topojson.feature(topology, topology.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", this.path);

      this.g.selectAll("circle")
        .data(data)
        .enter()
        .append("a")
        .append("circle")
        .attr("cx", d => this.projection([ d['longitude'], d['latitude'] ])[0])
        .attr("cy", d => this.projection([ d['longitude'], d['latitude'] ])[1])
        .attr("r", 2)
        .style("fill", "aqua")
        .style("opacity", 0.25)
        .on("mouseover", d => {
          this.tooltip.transition()
            .duration(300)
            .style("opacity", 1)
            .style("background", "black")
            .style("color", "white")
            .style("letter-spacing", "1px")
            .style("text-shadow", "none");

          this.tooltip.html(`
              ${d['country_txt']}, ${d['city']} <br> 
              ${d['attacktype1_txt']} <br>
              ${d['iyear']}
            `)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          this.tooltip.transition()
            .duration(300)
            .style("opacity", 0);
        })
        .on("click", d => console.log(d['country_txt']));

      this.svg.call(this.zoomBehavior)
      console.log('map drawn')
    })
  }
}

export default Map
