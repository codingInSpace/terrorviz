import express from 'express'
import incidentRoutes from './incidents'

const router = express.Router()
router.use('/', incidentRoutes)

export default router
