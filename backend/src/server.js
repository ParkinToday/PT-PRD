import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import createPaymentRouter from './routes/createPaymentIntent.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

// Serve static files from the frontend build directory
const frontendPath = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendPath))

// API routes
app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api', createPaymentRouter)

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})



