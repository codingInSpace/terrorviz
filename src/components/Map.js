import * as topojson from 'topojson'
import dbScan from './dbscan'
import {
  geoMercator,
  select,
  geoPath,
  zoom,
  json,
  event
} from 'd3'
import * as scale from 'd3-scale'

/**
 * Main map class
 */
class Map {
    constructor(width = 1600, height = 800) {
        this.hasDrawn = false;
        this.clickableClustersActive = false
        this.data;

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

        this.renderMap()

        this.svg.call(this.zoomBehavior)

        const button = document.querySelector('#dbscan-button').addEventListener('click', () => {
          this.dbscanOnClick(this.data)
        })
    }

    zoomed() {
        const {x, y, k} = event.transform  // event.transform.x, event.transform.y etc
        select('body').select('svg').select('g')
            .attr('transform', `translate(${x}, ${y}) scale(${k})`)
    }

    renderMap() {
        json('public/data/world-110m2.json', (error, topology) => {
            if (error) return console.error(error)

            this.g.selectAll("path")
                .data(topojson.feature(topology, topology.objects.countries).features)
                .enter()
                .append("path")
                .attr("d", this.path);
        })
    }

  /**
   * Remove all items drawn on Map
   */
  reset() {
      this.g.selectAll('circle').remove()
      this.svg.selectAll('circle').remove()
      this.svg.selectAll('pointGroup').remove()
    }

  /**
   * Draw items on Map
   * @param {array} data - Array of incidents data to display and project
   */
  draw(data) {

        // Reset previously plotted incidents if they exist
        if (!this.hasDrawn)
            this.hasDrawn = true
        else
            this.reset()

        this.data = data

        console.log('Drawing data on map...')

        this.g.selectAll("circle")
            .data(data)
            .enter()
            .append("a")
            .append("circle")
            .attr("cx", d => this.projection([d['longitude'], d['latitude']])[0])
            .attr("cy", d => this.projection([d['longitude'], d['latitude']])[1])
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

        console.log('Data on map updated.')
    }

    dbscanOnClick() {
      let dbscanArr = dbScan(this.data);

      let colorScale = scale.scaleOrdinal(scale.schemeCategory20c);

      this.g.selectAll("circle")
        .style("fill", function (d, i) {

          if (dbscanArr[i] === -1)
            return "white";
          else {
            return colorScale(dbscanArr[i]);
          }
        })
        .style("opacity", function (d, i) {

          if (dbscanArr[i] === -1)
            return 0;
        })

      if (this.clickableClustersActive)
        this.renderClusterCircles(dbscanArr)
    }

    renderClusterCircles(dbscanArr) {
        let numberOfClusters = Math.max(...dbscanArr);
        let clusterSumsLon = [], clusterSumsLat = [], numberOfpointsInCluster = [];
        let currentDataItem;

        let clusterMeanLon = [];
        let clusterMeanLat = [];

        // initialize clusterSums
        for(let k = 0; k < numberOfClusters; k++){

            clusterSumsLon.push(0);
            clusterSumsLat.push(0);
            numberOfpointsInCluster.push(0);
            clusterMeanLon.push(0);
            clusterMeanLat.push(0);
        }

        for(let i = 0; i < this.data.length; i++){

            currentDataItem = this.data[i];

            if(dbscanArr[i] != -1) {
                numberOfpointsInCluster[dbscanArr[i]-1] += 1;
                clusterSumsLon[dbscanArr[i]-1] += +currentDataItem.longitude;
                clusterSumsLat[dbscanArr[i]-1] += +currentDataItem.latitude;
            }
        }

        for(let j = 0; j < numberOfClusters; j++){

            clusterMeanLon[j] = clusterSumsLon[j] / numberOfpointsInCluster[j];
            clusterMeanLat[j] = clusterSumsLat[j] / numberOfpointsInCluster[j];
        }

        let radiusScale = scale.scaleLinear()
            .range([0,3])
            .domain([1,10]);

        let clusterCentroids = [];

        for(let o = 0; o < numberOfClusters; o++) {
            let obj = {
                lon: clusterMeanLon[o],
                lat:clusterMeanLat[o],
                numberOfPoints:numberOfpointsInCluster[o]
            };

            clusterCentroids.push(obj);
        }

        this.pointGroup = this.svg.append("pointGroup");

        this.svg.selectAll("pointGroup")
            .data(clusterCentroids)
            .enter().append("circle")
            .attr("r", d => radiusScale(d.numberOfPoints))
            .attr("cx", d => this.projection([d['lon'], d['lat']])[0])
            .attr("cy", d => this.projection([d['lon'], d['lat']])[1])
            .style("opacity", 0.6);
    }

  /**
   * Set clickable clusters state
   * @param {boolean} state - If clusters should be rendered as clickable objects or not
   */
  setState(state) {
    this.clickableClustersActive = state
  }

  /**
   * Get clickable clusters state
   * @returns {boolean}
   */
  getState() {
    return this.clickableClustersActive
  }
}
export default Map
