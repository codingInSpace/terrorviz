import store from './redux/store'
import * as actions from './redux/actions'

import Map from './components/Map'
import dbscan from './components/dbscan'
import YearRange from './components/YearRange'
import CLusterInfoBox from './components/ClusterInfoBox'

const getIncidentsFromRange = range => store.dispatch({
  type: actions.GET_INCIDENTS,
  payload: range
})
const showClusterInfo = data => store.dispatch({
  type: actions.SHOW_CLUSTER_INFO,
  payload: { visible: true, data: data }
})
const hideClusterInfo = data => store.dispatch({
  type: actions.SHOW_CLUSTER_INFO,
  payload: { visible: false, data: null }
})

const map = new Map(window.innerWidth, 750, showClusterInfo, hideClusterInfo)
const yearRange = new YearRange(window.innerWidth, 80, getIncidentsFromRange)
const clusterInfoBox = new CLusterInfoBox()

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

  if (state.clusterInfo.visible) {
    clusterInfoBox.show(state.clusterInfo.data)
  } else {
    clusterInfoBox.hide()
  }
})
