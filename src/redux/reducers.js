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

const incidentsReducer = (state = [], action) => {
  switch(action.type) {
    case actions.RECEIVE_INCIDENTS:
      state = [...state.slice(), ...action.payload.slice()]
      break;
  }

  return state
}

const rootReducer = combineReducers({
  loadedYears: loadedYearsReducer,
  incidents: incidentsReducer
})

export default rootReducer
