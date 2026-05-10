import express from 'express'
import { loginAdmin, addDoctor, allDoctors, approveDoctor, allAppointments, cancelAppointment, adminDashboard } from '../controller/adminController.js'
import authAdmin from '../middleware/authAdmin.js'
import upload from '../middleware/upload.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.get('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/approve-doctor', authAdmin, approveDoctor)
adminRouter.get('/appointments', authAdmin, allAppointments)
adminRouter.post('/cancel-appointment', authAdmin, cancelAppointment)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter
