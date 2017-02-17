import axios from 'axios'

// Sample request
axios.get(`${process.env.API_HOST}/incidents/test`)
  .then(response => {
    const data = response.data
    console.log(data);
    console.log(data[0]['qeventid'])
  })
  .catch(error => {
    console.error(error);
  });


