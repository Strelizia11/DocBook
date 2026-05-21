import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

// Doctor self-registration (pending approval)
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees)
      return res.json({ success: false, message: 'Missing details' })

    if (!validator.isEmail(email))
      return res.json({ success: false, message: 'Enter a valid email' })

    if (password.length < 8)
      return res.json({ success: false, message: 'Password must be at least 8 characters' })

    const exists = await doctorModel.findOne({ email })
    if (exists) return res.json({ success: false, message: 'Email already registered' })

    const hashedPassword = await bcrypt.hash(password, 10)

    let imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg'
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      imageUrl = imageUpload.secure_url
    }

    const doctorData = {
      name, email,
      password: hashedPassword,
      image: imageUrl,
      speciality, degree, experience, about,
      fees: Number(fees),
      address: address ? JSON.parse(address) : { line1: '', line2: '' },
      approved: false,
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.json({ success: true, message: 'Application submitted. Wait for admin approval.' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) return res.json({ success: false, message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' })

    if (!doctor.approved)
      return res.json({ success: false, message: 'Account pending admin approval' })

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get doctor appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Mark appointment completed
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)

    if (appointment.docId.toString() !== docId.toString())
      return res.json({ success: false, message: 'Unauthorized action' })

    await appointmentModel.findByIdAndUpdate(appointmentId, { status: 'completed' })
    res.json({ success: true, message: 'Appointment completed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Cancel appointment by doctor
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)

    if (appointment.docId.toString() !== docId.toString())
      return res.json({ success: false, message: 'Unauthorized action' })

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, status: 'cancelled' })

    const { slotDate, slotTime } = appointment
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get doctor profile
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body
    const profileData = await doctorModel.findById(docId).select('-password')
    res.json({ success: true, profileData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Get all doctors (for patient browsing)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ approved: true }).select('-password -email')
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Doctor dashboard stats
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })

    let earnings = 0
    appointments.forEach(item => {
      if (item.status === 'completed') earnings += item.amount
    })

    const patients = [...new Set(appointments.map(item => item.userId))]

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.slice(-5).reverse()
    }
    res.json({ success: true, dashData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export { registerDoctor, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorProfile, updateDoctorProfile, doctorList, doctorDashboard }
