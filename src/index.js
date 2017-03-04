import store from './redux/store'
import * as actions from './redux/actions'

import axios from 'axios'
import Map from './components/Map'
import YearRange from './components/YearRange'

const map = new Map()
const yearRange = new YearRange()

//const loader = document.querySelector('#map-loading-spinner')
//loader.style.display = 'block'
//const snackbarContainer = document.querySelector('#simple-toast');

//// Sample request
//axios.get(`${process.env.API_HOST}/incidents/year/2015`)
//  .then(response => {
//    const data = response.data
//    console.log(`plotting incidents in 2015, ${data.length} in total`)
//    map.draw(data)
//    loader.style.display = 'none'
//  })
//  .catch(error => {
//    console.error(error)
//    const data = {message: `Couldn't fetch data`};
//    snackbarContainer.MaterialSnackbar.showSnackbar(data);
//  });

const initialYearRange = [1995]
store.dispatch({type: actions.GET_INCIDENTS, payload: initialYearRange})

store.subscribe(() => {
  console.log(store.getState())
})
