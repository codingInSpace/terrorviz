import express from 'express'
import incidentCtrl from '../controllers/incidents'
const router = express.Router()

router.route('/')
  .get(incidentCtrl.list)

router.route('/test')
  .get(incidentCtrl.test)

export default router
