import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import recommendationsRoutes from './routes/recommendations'
import universitiesRoutes from './routes/universities'
import scholarshipsRoutes from './routes/scholarships'
import userDataRoutes from './routes/userData'

dotenv.config()

const app = express()
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})

app.use(cors({
  origin: true, // Allow all origins in dev to avoid CORS issues
  credentials: true,
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api', limiter)

app.use('/api/auth', authRoutes)
app.use('/api/recommendations', recommendationsRoutes)
app.use('/api/universities', universitiesRoutes)
app.use('/api/scholarships', scholarshipsRoutes)
app.use('/api/user', userDataRoutes)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


app.get('/', (req, res) => {
  res.json({ 
    message: 'CollegeFinder API Server',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      recommendations: '/api/recommendations',
      universities: '/api/universities',
      scholarships: '/api/scholarships'
    }
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})

export default app
