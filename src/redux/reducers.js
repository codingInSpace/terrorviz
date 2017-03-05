import { combineReducers } from 'redux';
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

const incidentsReducer = (state = [], action) => {
  switch(action.type) {
    case actions.RECEIVE_INCIDENTS:
      state = [...state.slice(), ...action.payload]
      break;
  }

  return state
}

const rootReducer = combineReducers({
  loadedYears: loadedYearsReducer,
  incidents: incidentsReducer,
  rangeToShow: rangeToShowReducer
})

export default rootReducer
