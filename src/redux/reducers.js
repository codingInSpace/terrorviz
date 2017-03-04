import { combineReducers } from 'redux';
import * as actions from './actions'

const yearRangeReducer = (state = [], action) => {
  switch(action.type) {
    case actions.SET_NEW_YEAR_RANGE:
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
  yearRange: yearRangeReducer,
  incidents: incidentsReducer
})

export default rootReducer
