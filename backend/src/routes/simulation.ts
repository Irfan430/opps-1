import express from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { auth } from '../middleware/auth'
import { SimulationService } from '../services/simulationService'
import { logger } from '../utils/logger'

const router = express.Router()
const simulationService = new SimulationService()

// Validation middleware
const validateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    })
  }
  next()
}

// Get all available simulation scenarios
router.get('/scenarios', auth, async (req, res) => {
  try {
    const scenarios = await simulationService.getAvailableScenarios()
    res.json({
      success: true,
      data: scenarios
    })
  } catch (error) {
    logger.error('Error fetching scenarios:', error)
    res.status(500).json({
      error: 'Failed to fetch simulation scenarios'
    })
  }
})

// Get running simulations
router.get('/running', auth, async (req, res) => {
  try {
    const runningSimulations = await simulationService.getRunningSimulations()
    res.json({
      success: true,
      data: runningSimulations
    })
  } catch (error) {
    logger.error('Error fetching running simulations:', error)
    res.status(500).json({
      error: 'Failed to fetch running simulations'
    })
  }
})

// Start a new simulation
router.post('/start',
  auth,
  [
    body('scenarioId').isString().notEmpty().withMessage('Scenario ID is required'),
    body('targetSystems').isArray().optional().withMessage('Target systems must be an array'),
    body('intensity').isIn(['low', 'medium', 'high']).optional().withMessage('Invalid intensity level'),
    body('duration').isInt({ min: 5, max: 120 }).optional().withMessage('Duration must be between 5 and 120 minutes')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { scenarioId, targetSystems, intensity = 'medium', duration = 30 } = req.body
      const userId = req.user?.id

      const simulation = await simulationService.startSimulation({
        scenarioId,
        targetSystems,
        intensity,
        duration,
        userId
      })

      logger.info(`Simulation started: ${simulation.id} by user ${userId}`)

      res.status(201).json({
        success: true,
        data: simulation
      })
    } catch (error) {
      logger.error('Error starting simulation:', error)
      res.status(500).json({
        error: 'Failed to start simulation'
      })
    }
  }
)

// Get simulation details
router.get('/:id',
  auth,
  [param('id').isUUID().withMessage('Invalid simulation ID')],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params
      const simulation = await simulationService.getSimulationById(id)

      if (!simulation) {
        return res.status(404).json({
          error: 'Simulation not found'
        })
      }

      res.json({
        success: true,
        data: simulation
      })
    } catch (error) {
      logger.error('Error fetching simulation:', error)
      res.status(500).json({
        error: 'Failed to fetch simulation details'
      })
    }
  }
)

// Stop a simulation
router.post('/:id/stop',
  auth,
  [param('id').isUUID().withMessage('Invalid simulation ID')],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user?.id

      await simulationService.stopSimulation(id, userId)

      logger.info(`Simulation stopped: ${id} by user ${userId}`)

      res.json({
        success: true,
        message: 'Simulation stopped successfully'
      })
    } catch (error) {
      logger.error('Error stopping simulation:', error)
      res.status(500).json({
        error: 'Failed to stop simulation'
      })
    }
  }
)

// Pause a simulation
router.post('/:id/pause',
  auth,
  [param('id').isUUID().withMessage('Invalid simulation ID')],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user?.id

      await simulationService.pauseSimulation(id, userId)

      logger.info(`Simulation paused: ${id} by user ${userId}`)

      res.json({
        success: true,
        message: 'Simulation paused successfully'
      })
    } catch (error) {
      logger.error('Error pausing simulation:', error)
      res.status(500).json({
        error: 'Failed to pause simulation'
      })
    }
  }
)

// Resume a simulation
router.post('/:id/resume',
  auth,
  [param('id').isUUID().withMessage('Invalid simulation ID')],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user?.id

      await simulationService.resumeSimulation(id, userId)

      logger.info(`Simulation resumed: ${id} by user ${userId}`)

      res.json({
        success: true,
        message: 'Simulation resumed successfully'
      })
    } catch (error) {
      logger.error('Error resuming simulation:', error)
      res.status(500).json({
        error: 'Failed to resume simulation'
      })
    }
  }
)

// Get simulation results
router.get('/:id/results',
  auth,
  [param('id').isUUID().withMessage('Invalid simulation ID')],
  validateRequest,
  async (req, res) => {
    try {
      const { id } = req.params
      const results = await simulationService.getSimulationResults(id)

      res.json({
        success: true,
        data: results
      })
    } catch (error) {
      logger.error('Error fetching simulation results:', error)
      res.status(500).json({
        error: 'Failed to fetch simulation results'
      })
    }
  }
)

// Get simulation history
router.get('/',
  auth,
  [
    query('page').isInt({ min: 1 }).optional().withMessage('Page must be a positive integer'),
    query('limit').isInt({ min: 1, max: 100 }).optional().withMessage('Limit must be between 1 and 100'),
    query('status').isIn(['running', 'completed', 'failed', 'stopped']).optional().withMessage('Invalid status')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const status = req.query.status as string
      const userId = req.user?.id

      const simulations = await simulationService.getSimulationHistory({
        userId,
        page,
        limit,
        status
      })

      res.json({
        success: true,
        data: simulations
      })
    } catch (error) {
      logger.error('Error fetching simulation history:', error)
      res.status(500).json({
        error: 'Failed to fetch simulation history'
      })
    }
  }
)

export { router as simulationRoutes }