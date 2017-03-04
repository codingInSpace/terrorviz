import express from 'express'
import incidentCtrl from '../controllers/incidents'
const router = express.Router()

// api/incidents -- list first 10000 items
router.route('/')
  .get(incidentCtrl.list)

// api/incidents/xxx -- list all with limit param
router.route('/:limit')
  .get(incidentCtrl.list)

// api/incidents/year/xxx -- list all for given year param
router.route('/year/:y')
  .get(incidentCtrl.getYear)

// api/incidents/yearrange/xxxxxxxx -- list all for given year range param
// example: api/incidents/yearrange/19982002 for 1998 to and including 2002
router.route('/yearrange/:range')
  .get(incidentCtrl.getYearRange)

// api/incidents/test -- get one incident to see that it works
router.route('/test')
  .get(incidentCtrl.test)

export default router
