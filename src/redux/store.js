import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers'
import { rootSaga } from './sagas'
import { Map } from 'immutable'

const sagaMiddleware = createSagaMiddleware()

// Use redux dev tools if installed as chrome extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const initialState = {
  incidents: Map({}),
  loadedYears: [],
  rangeToShow: [],
  mapShouldUpdate: false
}

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga)

export default store
