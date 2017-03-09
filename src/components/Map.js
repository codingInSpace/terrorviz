import * as topojson from 'topojson'
import dbScan from './dbscan'
import {
  geoMercator,
  select,
  geoPath,
  zoom,
  json,
  event,
  axisBottom,
  scaleLinear,
  range
} from 'd3'
import * as scale from 'd3-scale'

/**
 * Main map class
 */
class Map {
  constructor(width = 1600, height = 800, showClusterInfo, hideClusterInfo) {
    this.hasDrawn = false;
    this.clickableClustersActive = false
    this.showClusterInfo = showClusterInfo
    //this.hideClusterInfo = hideClusterInfo
    this.data;
    this.legendColorScale = scaleLinear().domain([0,10,20]).range(["green","yellow","red"]);
    this.checker = true
    this.width = width
    this.isClustered = false;

    this.projection = geoMercator()
      .scale((width - 3) / (2 * Math.PI))
      .translate([width / 2, height / 1.75]);

    this.svg = select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

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

    this.colorByFatalitiesButton = document.querySelector('#fatalities-button')
    this.colorByFatalitiesButton.addEventListener('click', () => {
      this.colorByFatality()
    })

    this.clusterInfoToggleContainer = document.querySelector('#cluster-info-toggle-container')
    this.clusterInfoToggle = document.querySelector('#cluster-info-toggle-input')
    this.clusterInfoToggle.addEventListener('change', () => {
      if (this.clusterInfoToggle.checked)
        this.renderClusterCircles()
      else {
        this.reset()
        this.draw(this.data)
        this.dbscanOnClick()
      }
    })
  }

  // On map zoomed callback
  zoomed() {
    const {x, y, k} = event.transform  // event.transform.x, event.transform.y etc
    select('body').select('svg').select('g')
      .attr('transform', `translate(${x}, ${y}) scale(${k})`)
  }

  /**
   * Render empty map
   */
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
   * Remove all items drawn on Map and clear state data
   */
  reset() {
    this.g.selectAll('circle').remove()
    this.g.selectAll('pointGroup').remove()
    this.svg.selectAll('.legendWrapper').remove()
    this.checker = true
    this.isClustered = false
    this.colorByFatalitiesButton.disabled = false

    // Hide toggle
    this.clusterInfoToggleContainer.style.display = 'none'
  }

  /**
   * Draw items on Map
   * @param {Array} data - Array of incidents data to display and project
   */
  draw(data) {

    // Reset previously plotted incidents if they exist
    if (!this.hasDrawn)
      this.hasDrawn = true
    else
      this.reset()

    this.data = data

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
      .style("visibility", d => {
        if (!d['longitude'] && !d['latitude'])
          return 'hidden' //don't project undefined positions on null island
      })
      .on("mouseover", d => {
        this.tooltip.transition()
          .duration(300)
          .style("opacity", 1)
          .style("background", "black")
          .style("color", "white")
          .style("letter-spacing", "1px")
          .style("text-shadow", "none");

        this.tooltip.html(`
            <strong>${d['country_txt']}, ${d['city']} <br> 
            ${d['attacktype1_txt']} </strong> <br>
            ${d['summary']}
          `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        this.tooltip.transition()
          .duration(300)
          .style("opacity", 0);
      })
      .on("click", d => console.log(d));
  }

  /**
   * Calcuclate and display clusters
   */
  dbscanOnClick() {
    let dbscanArr = dbScan(this.data);
    this.isClustered = true
    this.colorByFatalitiesButton.disabled = true

    // Show toggle
    this.clusterInfoToggleContainer.style.display = 'block'

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

    this.clusteredData = dbscanArr
  }

  renderClusterCircles() {
    let dbscanArr = this.clusteredData
    let colorScale = scale.scaleOrdinal(scale.schemeCategory20c);
    let numberOfClusters = Math.max(...dbscanArr);
    let clusterSumsLon = [], clusterSumsLat = [], numberOfpointsInCluster = [];
    let currentDataItem;

    let clusterMeanLon = [];
    let clusterMeanLat = [];
    let clusterFatalities = [];

    // initialize clusterSums
    for(let k = 0; k < numberOfClusters; k++){

      clusterSumsLon.push(0);
      clusterSumsLat.push(0);
      numberOfpointsInCluster.push(0);
      clusterMeanLon.push(0);
      clusterMeanLat.push(0);
      clusterFatalities.push(0)

    }

    for(let i = 0; i < this.data.length; i++){

      currentDataItem = this.data[i];

      if(dbscanArr[i] != -1) {
        numberOfpointsInCluster[dbscanArr[i]-1] += 1;
        clusterSumsLon[dbscanArr[i]-1] += +currentDataItem.longitude;
        clusterSumsLat[dbscanArr[i]-1] += +currentDataItem.latitude;
        clusterFatalities[dbscanArr[i]-1] += +currentDataItem.nkill;
      }
    }

    for(let j = 0; j < numberOfClusters; j++){

      clusterMeanLon[j] = clusterSumsLon[j] / numberOfpointsInCluster[j];
      clusterMeanLat[j] = clusterSumsLat[j] / numberOfpointsInCluster[j];
    }

    let radiusScale = scale.scaleLinear()
      .domain([0,20])
      .range([0,2]);

    let clusterCentroids = [];

    for(let o = 0; o < numberOfClusters; o++) {
      let obj = {
        lon: clusterMeanLon[o],
        lat:clusterMeanLat[o],
        numberOfPoints:numberOfpointsInCluster[o],
        fatalities: clusterFatalities[o],
        clusterColor: o+1
      };

      clusterCentroids.push(obj);
    }

    this.pointGroup = this.g.append("pointGroup");

    // Remove original dots
    this.g.selectAll('circle').remove();

    // Add cluster circles
    this.g.selectAll("pointGroup").select("circle")
      .data(clusterCentroids)
      .enter().append("circle")
      .attr("r", d => 3*Math.sqrt(radiusScale(d.numberOfPoints)))
      .attr("cx", d => this.projection([d['lon'], d['lat']])[0])
      .attr("cy", d => this.projection([d['lon'], d['lat']])[1])
      .style("opacity", 0.9)
      .style("fill", d => colorScale(d.clusterColor))
      .style("cursor", "pointer")
      .on('click', d => {
        this.showClusterInfo(d)
      });
  }

  colorByFatality() {
    const points = this.g.selectAll('circle')

    if(this.checker) {
      points.style("fill", d => {
        this.checker = false;
        this.legend()
        return this.isClustered ? this.legendColorScale(d.fatalities / d.numberOfPoints) : this.legendColorScale(d.nkill + d.nwound)
      })
    } else {
      points.style("fill", "aqua");
      this.checker = true;
    }
  }

  legend() {
    let legendWidth = Math.min(100*2, 400);

    let tempScale = scaleLinear()
      .domain([0, 25])
      .range([0, this.width]);

    //Calculate the variables for the temp gradient
    let numStops = 12;
    let tempRange = tempScale.domain();
    tempRange[2] = tempRange[1] - tempRange[0];
    let tempPoint = [];
    for(let i = 0; i < numStops; i++) {
      tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
    }//for i

    //Create the gradient
    this.svg.append("defs")
      .append("linearGradient")
      .attr("id", "legend-weather")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%")
      .selectAll("stop")
      .data(range(numStops))
      .enter().append("stop")
      .attr("offset", (d,i) => tempScale( tempPoint[i] )/this.width )
      .attr("stop-color", (d,i) => this.legendColorScale( tempPoint[i] ));

    //Color Legend container
    var legendsvg = this.svg.append("g")
      .attr("class", "legendWrapper")
      .attr("transform", `translate(${this.width - 170}, 725)`);

    //Draw the Rectangle
    legendsvg.append("rect")
      .attr("class", "legendRect")
      .attr("x", -legendWidth/2 + 10)
      .attr("y", 0)
      .attr("rx", 8/2)
      .attr("width", legendWidth)
      .attr("height", 8)
      .style("fill", "url(#legend-weather)");

    //Append title
    legendsvg.append("text")
      .attr("class", "legendTitle")
      .attr("x", 10)
      .attr("y", -10)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-family", `"Roboto","Helvetica","Arial",sans-serif`)
      .style("font-weight", `400`)
      .text("Number Of Fatalities");

    //Set scale for x-axis
    var xScale = scaleLinear()
      .range([-legendWidth/2, legendWidth/2])
      .domain([-10,30] );


    //Define x-axis
    var xAxis = axisBottom()
      .ticks(4)
      .tickFormat(function(d,i) { if(i!=4){return i*5;}else{return "> " + i*5} })
      .scale(xScale);

    //Set up X axis
    legendsvg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(10, 10)`)
      .call(xAxis)
      .selectAll("text")
      .style("fill", "white")
      .style("font-family", `"Roboto","Helvetica","Arial",sans-serif`)
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
