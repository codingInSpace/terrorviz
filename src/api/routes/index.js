import express from 'express'
import incidentRoutes from './incidents'

const router = express.Router()

// Check service health
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// Mount incident routes on /api/incidents
router.use('/incidents', incidentRoutes)

export default router
