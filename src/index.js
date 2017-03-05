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

store.subscribe(() => {
  const state = store.getState()

  if (state.mapShouldUpdate) {
    let incidents = []
    const interval = state.rangeToShow.slice()

    if (!interval[1])
      incidents.push(...state.incidents.get(interval[0].toString()))
    else {
      while(interval[0] !== (interval[1] + 1)) {
        incidents.push(...state.incidents.get(interval[0].toString()))
        interval[0] = (interval[0] + 1)
      }
    }

    map.draw(incidents)
    store.dispatch({type: actions.SET_MAP_SHOULD_UPDATE, payload: false})
  }
})
