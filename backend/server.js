import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import initSocket from './socket/socket.js'

dotenv.config()
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL)
console.log("ADMIN_EMAIL:", process.env.ADMIN_PASSWORD) // ← add this

connectDB()
connectCloudinary()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

initSocket(io)

app.use(cors())
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/admin', adminRouter)

app.get('/', (req, res) => res.send('Book a Doctor API is running'))

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
