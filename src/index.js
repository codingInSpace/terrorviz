import store from './redux/store'
import * as actions from './redux/actions'

import Map from './components/Map'
import YearRange from './components/YearRange'
//import CLusterInfoToggle from './components/ClusterInfoToggle'
import CLusterInfoBox from './components/ClusterInfoBox'

const getIncidentsFromRange = range => store.dispatch({
  type: actions.GET_INCIDENTS,
  payload: range
})
const showClusterInfo = clusterObject => store.dispatch({
  type: actions.SHOW_CLUSTER_INFO, payload: clusterObject
})
const hideClusterInfo = () => store.dispatch({
  type: actions.HIDE_CLUSTER_INFO, payload: null
})
//const setCLusterInfoActive = () => store.dispatch({
//  type: actions.SET_CLUSTER_INFO_ACTIVE, payload: true
//})
//const setCLusterInfoInactive = () => store.dispatch({
//  type: actions.SET_CLUSTER_INFO_INACTIVE, payload: false
//})

const map = new Map(window.innerWidth, 760, showClusterInfo, hideClusterInfo)
const yearRange = new YearRange(window.innerWidth, 80, getIncidentsFromRange)
const clusterInfoBox = new CLusterInfoBox(hideClusterInfo)

document.querySelector('#reset-button').addEventListener('click', () => {
  map.reset()
  yearRange.reset()
})

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

  // Update cluster info box
  if (state.clusterInfo.visible) {
    clusterInfoBox.show(state.clusterInfo.data)
  } else {
    clusterInfoBox.hide()
  }
})
