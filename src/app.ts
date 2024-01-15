import 'reflect-metadata'
import { Request, Response, NextFunction } from 'express'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth'
import productRoutes from './routes/product'
import tradeRoutes from './routes/trade'
import myDataSource from './config/dataSource'
import profileRoutes from './routes/profile'

const app = express()

// establish database connection
myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    exposedHeaders: 'set-cookie',
    credentials: true,
    origin: 'http://localhost:3000',
  })
)

// Error handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err) // store error event to some lg file
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// Routes
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/trade', tradeRoutes)
app.use('/profile', profileRoutes)

app.get('/', (req, res) => {
  res.send('Hello There')
})

// Start the server
const port = 3001
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`)
})
