import store from './redux/store'
import * as actions from './redux/actions'

import Map from './components/Map'
import YearRange from './components/YearRange'

const getIncidentsFromRange = range => store.dispatch({
  type: actions.GET_INCIDENTS,
  payload: range
})

const map = new Map()
const yearRange = new YearRange(1600, 80, getIncidentsFromRange)

const initialYearRange = [1995, 1996]
store.dispatch({type: actions.GET_INCIDENTS, payload: initialYearRange})

let currentRange = []

store.subscribe(() => {
  const state = store.getState()
  let previousRange = currentRange.slice()
  currentRange = state.rangeToShow.slice()

  const mapShouldUpdate = (previousRange[0] !== currentRange[0] || previousRange[1] !== currentRange[1])
  if (mapShouldUpdate) {
    console.log('update map')
    let incidents = []
    const interval = state.rangeToShow
    for (let i = 0; i < state.incidents.length; ++i) {
      const year = parseFloat(state.incidents[i]['iyear'])
      if (year >= interval[0] || year <= interval[1])
        incidents.push(state.incidents[i])
    }

    map.draw(state.incidents)
  }
})
