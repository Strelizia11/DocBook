import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
import appointmentModel from '../models/appointmentModel.js'

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD)
      return res.json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ email }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Add doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
      return res.json({ success: false, message: 'Missing details' })

    if (!validator.isEmail(email))
      return res.json({ success: false, message: 'Enter a valid email' })

    if (password.length < 8)
      return res.json({ success: false, message: 'Password must be at least 8 characters' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })

    const doctorData = {
      name, email,
      password: hashedPassword,
      image: imageUpload.secure_url,
      speciality, degree, experience, about,
      fees,
      address: JSON.parse(address),
      approved: true,
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({ success: true, message: 'Doctor added' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get all doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Approve or reject doctor
const approveDoctor = async (req, res) => {
  try {
    const { docId, approved } = req.body
    await doctorModel.findByIdAndUpdate(docId, { approved })
    res.json({ success: true, message: `Doctor ${approved ? 'approved' : 'rejected'}` })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get all appointments
const allAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Cancel appointment (admin)
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, status: 'cancelled' })

    const { docId, slotDate, slotTime } = appointment
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Admin dashboard stats
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.slice(-5).reverse()
    }
    res.json({ success: true, dashData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { loginAdmin, addDoctor, allDoctors, approveDoctor, allAppointments, cancelAppointment, adminDashboard }