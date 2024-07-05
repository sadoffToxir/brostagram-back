import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'
import likeRoutes from './routes/likeRoutes'
import commentRoutes from './routes/commentRoutes'
import followRoutes from './routes/followRoutes'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5400', // Update to match your frontend's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // Enable if you need to send cookies or authorization headers
}))

// Database connection
mongoose.connect(process.env.MONGO_URI as string).then(() => {
  console.log('Connected to MongoDB')
}).catch((error) => {
  console.error('Error connecting to MongoDB', error)
})

app.use('/api/user', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/posts', likeRoutes)
app.use('/api/posts', commentRoutes)
app.use('/api/user', followRoutes)

app.get('/', (req, res) => {
  res.send('Brostagram API')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
