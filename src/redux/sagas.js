import request from 'axios'
import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as actions from './actions'

const loader = document.querySelector('#map-loading-spinner')
const snackbarContainer = document.querySelector('#simple-toast');

const getLoadedYears = state => state.loadedYears

export const getIncidents = function * (action) {
  let reqUrl = `${process.env.API_HOST}/incidents/`
  let rangeToGet = action.payload
  const loadedYears = yield select(getLoadedYears)

  // Set the range as range to show
  yield put({type: actions.SET_RANGE_TO_SHOW, payload: rangeToGet})

  // Show loading spinner
  loader.style.display = 'block'

  // Handle range
  if (rangeToGet.length < 2) {
    if (loadedYears.includes(rangeToGet[0]))
      return //no need to request the year
    else
      reqUrl += `year/${rangeToGet[0]}` //request for single year
  } else {

    // Limit range to what doesn't already exist on client
    const newRange = []
    let counter = 0
    while(rangeToGet[0] + counter !== rangeToGet[1]) {
      const year = rangeToGet[0] + counter
      if (!loadedYears.includes(year))
        newRange.push(year)

      ++counter
    }
    if (!loadedYears.includes(rangeToGet[1]))
      newRange.push(rangeToGet[1])

    rangeToGet = newRange.slice()

    reqUrl += `yearrange/${rangeToGet[0]}${rangeToGet[1]}` //Request for range of years
  }

  try {
    const returnData = yield call(request.get, reqUrl)
    const data = returnData.data

    if (!data || typeof data === 'string')
      throw `Couldn't make request to api`

    // Put requested years in loaded years state
    if (rangeToGet.length === 1) {
      if(!loadedYears.includes(rangeToGet[0]))
        yield put({type: actions.MARK_NEW_LOADED_YEAR, payload: rangeToGet[0]})

    } else {
      let counter = 0
      while (rangeToGet[0] + counter !== rangeToGet[1]) {
        const year = rangeToGet[0] + counter
        if(!loadedYears.includes(year))
          yield put({type: actions.MARK_NEW_LOADED_YEAR, payload: year})

        ++counter
      }
      if(!loadedYears.includes(rangeToGet[1]))
        yield put({type: actions.MARK_NEW_LOADED_YEAR, payload: rangeToGet[1]})
    }

    yield put({type: actions.RECEIVE_INCIDENTS, payload: data})
    loader.style.display = 'none'

  } catch (error) {
    loader.style.display = 'none'
    console.error(error)
    snackbarContainer.MaterialSnackbar.showSnackbar({ message: error.toString() });
  }
}

export const rootSaga = function * () {
  yield takeLatest(actions.GET_INCIDENTS, getIncidents)
}
