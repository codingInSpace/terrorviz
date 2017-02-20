import express from 'express'
import incidentCtrl from '../controllers/incidents'
const router = express.Router()

// api/incidents -- list all
router.route('/')
  .get(incidentCtrl.list)

// api/incidents/year/xxxx -- list all for given year param
router.route('/year/:y')
  .get(incidentCtrl.getYear)

// api/incidents/test -- get one incident to see that it works
router.route('/test')
  .get(incidentCtrl.test)

export default router
