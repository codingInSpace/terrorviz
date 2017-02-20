import axios from 'axios'

// Sample request
axios.get(`${process.env.API_HOST}/incidents/`)
  .then(response => {
    const data = response.data
    console.log(data);
  })
  .catch(error => console.error(error));
