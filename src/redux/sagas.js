import request from 'axios'
import { call, put, takeLatest, select } from 'redux-saga/effects'
import * as actions from './actions'

const loader = document.querySelector('#map-loading-spinner')
const snackbarContainer = document.querySelector('#simple-toast');

const getLoadedYears = state => state.loadedYears
const getRangeToShow = state => state.rangeToShow

export const getIncidents = function * (action) {
  if (!action.payload)
    return

  let reqUrl = `${process.env.API_HOST}/incidents/years`
  let firstAndLastYear = action.payload.slice()
  const loadedYears = yield select(getLoadedYears)

  // Check if selected years are different to current
  const rangeToShow = yield select(getRangeToShow)
  const mapShouldUpdate = (firstAndLastYear[0] !== rangeToShow[0] || firstAndLastYear[1] !== rangeToShow[1])

  // Set the range as range to show
  yield put({type: actions.SET_RANGE_TO_SHOW, payload: firstAndLastYear})

  // Show loading spinner
  loader.style.display = 'block'

  // Will contain years to request from api
  let rangeToGet = []

  // Handle range
  if (firstAndLastYear.length < 2) {
    if (loadedYears.includes(firstAndLastYear[0])) {
      loader.style.display = 'none'

      if (mapShouldUpdate)
        yield put({type: actions.SET_MAP_SHOULD_UPDATE, payload: true})

      return //no need to request the year
    } else {
      rangeToGet = [firstAndLastYear[0]]
    }
  } else {

    // Limit range to what doesn't already exist on client
    const newRange = []
    let counter = 0
    while((firstAndLastYear[0] + counter) <= firstAndLastYear[1]) {
      const year = (firstAndLastYear[0] + counter)
      if (!loadedYears.includes(year))
        newRange.push(year)

      ++counter
    }

    rangeToGet = newRange.slice()
    console.log(rangeToGet)
  }

  try {
    const returnData = yield call(request.post, reqUrl, {rangeToGet})
    const data = returnData.data

    if (!data || typeof data === 'string')
      throw `Couldn't make request to api`

    // Put requested years in loaded years state
    if (rangeToGet.length === 1) {
      if(!loadedYears.includes(rangeToGet[0]))
        yield put({type: actions.MARK_NEW_LOADED_YEAR, payload: rangeToGet[0]})

    } else if (rangeToGet.length > 1) {
      let counter = 0
      while ((rangeToGet[0] + counter) <= rangeToGet[rangeToGet.length - 1]) {
        const year = (rangeToGet[0] + counter)
        if(!loadedYears.includes(year))
          yield put({type: actions.MARK_NEW_LOADED_YEAR, payload: year})

        ++counter
      }
    }

    if (rangeToGet.length > 0) {
      console.log('receiving incidents')
      yield put({type: actions.RECEIVE_INCIDENTS, payload: data})
    }
    console.log('received')
    // After incidents received in state, set flag to update map
    if (mapShouldUpdate)
      yield put({type: actions.SET_MAP_SHOULD_UPDATE, payload: true})

    yield loader.style.display = 'none'

  } catch (error) {
    loader.style.display = 'none'
    console.error(error)
    snackbarContainer.MaterialSnackbar.showSnackbar({ message: error.toString() });
  }
}

export const rootSaga = function * () {
  yield takeLatest(actions.GET_INCIDENTS, getIncidents)
}
