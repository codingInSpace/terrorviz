import express from 'express'
import incidentCtrl from '../controllers/incidents'
const router = express.Router()

// api/incidents/year/xxx -- list all for given year param
router.route('/year/:y')
  .get(incidentCtrl.getYear)

// api/incidents/years -- get all for year array post data
router.route('/years')
  .post(incidentCtrl.getYears)

// api/incidents/yearrange/xxxxxxxx -- list all for given year range param
// example: api/incidents/yearrange/19982002 for 1998 to and including 2002
router.route('/yearrange/:range')
  .get(incidentCtrl.getYearRange)

export default router
