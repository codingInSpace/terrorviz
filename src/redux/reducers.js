import { combineReducers } from 'redux';
import { Map } from 'immutable'
import * as actions from './actions'

const loadedYearsReducer = (state = [], action) => {
  switch(action.type) {
    case actions.MARK_NEW_LOADED_YEAR:
      state = [...state.slice(), action.payload]
      break;
  }

  return state
}

const rangeToShowReducer = (state = [], action) => {
  switch(action.type) {
    case actions.SET_RANGE_TO_SHOW:

      if (action.payload.length === 1)
        action.payload = [action.payload[0], null]

      state = action.payload
      break;
  }

  return state
}

const incidentsReducer = (state = Map({}), action) => {
  switch(action.type) {
    case actions.RECEIVE_INCIDENTS_OF_A_YEAR:
      state = state.set(action.payload.year.toString(), action.payload.data)
      break;
  }

  return state
}

const clusterInfoReducer = (state = {}, action) => {
  switch(action.type) {
    case actions.SHOW_CLUSTER_INFO:
      state = {
        visible: true,
        data: action.payload
      }
      break;

    case actions.HIDE_CLUSTER_INFO:
      state = {
        visible: false,
        data: null
      }
      break;
  }

  return state
}

const clusterInfoToggleReducer = (state = false, action) => {
  switch(action.type) {
    case actions.SET_CLUSTER_INFO_ACTIVE:
      state = true
      break;

    case actions.SET_CLUSTER_INFO_INACTIVE:
      state = false
      break;
  }

  return state
}

const mapUpdateReducer = (state = false, action) => {
  switch(action.type) {
    case actions.SET_MAP_SHOULD_UPDATE:
      state = action.payload
      break;
  }

  return state

}

const rootReducer = combineReducers({
  loadedYears: loadedYearsReducer,
  incidents: incidentsReducer,
  rangeToShow: rangeToShowReducer,
  mapShouldUpdate: mapUpdateReducer,
  clusterInfo: clusterInfoReducer,
  clusterInfoToggle: clusterInfoToggleReducer
})

export default rootReducer
