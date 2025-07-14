import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { authRoutes } from './routes/auth'
import { riskRoutes } from './routes/risk'
import { simulationRoutes } from './routes/simulation'
import { alertRoutes } from './routes/alerts'
import { metricsRoutes } from './routes/metrics'
import { connectDatabase } from './database/connection'
import { initializeRedis } from './services/redis'
import { setupSocketHandlers } from './sockets/socketHandlers'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

const PORT = process.env.API_PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}))
app.use(compression())
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/risk', riskRoutes)
app.use('/api/simulation', simulationRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/metrics', metricsRoutes)

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Cybersecurity Risk Simulation Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      risk: '/api/risk',
      simulation: '/api/simulation',
      alerts: '/api/alerts',
      metrics: '/api/metrics'
    },
    documentation: '/api/docs'
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  })
})

// Socket.IO setup
setupSocketHandlers(io)

// Start server
async function startServer() {
  try {
    // Initialize database connection
    await connectDatabase()
    logger.info('Database connected successfully')

    // Initialize Redis connection
    await initializeRedis()
    logger.info('Redis connected successfully')

    // Start the server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`Health check available at: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})

startServer()

export { app, io }