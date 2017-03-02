import axios from 'axios'
import Map from './components/Map'

const map = new Map();
const loader = document.getElementById('map-loading')

// Sample request
axios.get(`${process.env.API_HOST}/incidents/year/2015`)
  .then(response => {
    const data = response.data
    console.log(`plotting incidents in 2015, ${data.length} in total`)
    map.draw(data)
    loader.style.display = 'none'
  })
  .catch(error => console.error(error));

