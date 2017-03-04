import request from 'axios'
import { call, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga/effects'
import * as actions from './actions'

const loader = document.querySelector('#map-loading-spinner')
const snackbarContainer = document.querySelector('#simple-toast');

export const getIncidents = function * (action) {
  let reqUrl = `${process.env.API_HOST}/incidents/`
  const yearRange = action.payload

  if (yearRange.length < 2)
    reqUrl += `year/${yearRange[0]}`
  else {

    // Limit range to what doesn't already exist on client

    reqUrl += `yearrange/${yearRange[0]}${yearRange[1]}`
  }

  loader.style.display = 'block'

  try {
    const returnData = yield call(request.get, reqUrl)
    const data = returnData.data

    loader.style.display = 'none'

    for (const i in yearRange) {
      const aYear = yearRange[i]
      yield put({type: actions.MARK_NEW_LOADED_YEAR, payload: aYear})
    }

    yield put({type: actions.RECEIVE_INCIDENTS, payload: data})

  } catch (error) {
    loader.style.display = 'none'
    console.error(error)
    snackbarContainer.MaterialSnackbar.showSnackbar(error.toString());
  }
}

export const rootSaga = function * () {
  yield takeLatest(actions.GET_INCIDENTS, getIncidents)
}
