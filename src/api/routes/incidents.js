import express from 'express'
import incidentCtrl from '../controllers/incidents'
const router = express.Router()

router.route('/all')
  .get(incidentCtrl.getAll)

export default router
