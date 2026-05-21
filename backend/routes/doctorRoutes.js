import express from 'express'
import { registerDoctor, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorProfile, updateDoctorProfile, doctorList, doctorDashboard } from '../controller/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'
import upload from '../middleware/upload.js'

const doctorRouter = express.Router()

doctorRouter.post('/register', upload.single('image'), registerDoctor)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/list', doctorList)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)

export default doctorRouter
