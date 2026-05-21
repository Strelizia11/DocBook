import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const SPECIALITIES = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist',
  'Cardiologist', 'Orthopedic', 'Psychiatrist', 'Ophthalmologist',
]

const EXPERIENCE_OPTIONS = [
  '1 year', '2 years', '3 years', '4 years', '5 years',
  '6 years', '7 years', '8 years', '9 years', '10+ years',
]

const Register = () => {
  const { backendUrl, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [role, setRole] = useState('patient') // 'patient' | 'doctor'
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false) // for doctor pending state

  // Patient fields
  const [patientForm, setPatientForm] = useState({ name: '', email: '', password: '' })

  // Doctor fields
  const [doctorForm, setDoctorForm] = useState({
    name: '', email: '', password: '',
    speciality: '', degree: '', experience: '',
    about: '', fees: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handlePatientChange = e =>
    setPatientForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleDoctorChange = e =>
    setDoctorForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePatientSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/register`, patientForm)
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const handleDoctorSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(doctorForm).forEach(([k, v]) => formData.append(k, v))
      if (imageFile) formData.append('image', imageFile)

      const { data } = await axios.post(`${backendUrl}/api/doctor/register`, formData)
      if (data.success) {
        setSubmitted(true)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  // Doctor pending approval screen
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Your doctor account is under review. An admin will approve your application shortly.
              You'll be able to log in once approved.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-amber-700 text-sm mb-6">
              ⏳ Pending admin approval
            </div>
            <Link
              to="/doctor/login"
              className="block w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition-colors text-sm"
            >
              Go to Doctor Login
            </Link>
            <Link to="/" className="block text-sm text-slate-400 hover:text-slate-600 mt-3">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Create account</h1>
          <p className="text-slate-500 mt-2">Join DOC.tify as a patient or doctor</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setRole('patient')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'patient'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🧑‍💼 Patient
          </button>
          <button
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'doctor'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            👨‍⚕️ Doctor
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

          {/* ── PATIENT FORM ── */}
          {role === 'patient' && (
            <form onSubmit={handlePatientSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                <input
                  type="text" name="name" value={patientForm.name}
                  onChange={handlePatientChange} required placeholder="Juan dela Cruz"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email" name="email" value={patientForm.email}
                  onChange={handlePatientChange} required placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password" name="password" value={patientForm.password}
                  onChange={handlePatientChange} required minLength={8} placeholder="Minimum 8 characters"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          )}

          {/* ── DOCTOR FORM ── */}
          {role === 'doctor' && (
            <form onSubmit={handleDoctorSubmit} className="space-y-5">

              {/* Notice banner */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-blue-700 text-xs leading-relaxed">
                📋 Doctor accounts require admin approval before you can log in. Fill in your details below and we'll review your application.
              </div>

              {/* Profile photo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Profile photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 flex-shrink-0">
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      : <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                  </div>
                  <label className="cursor-pointer text-sm text-primary font-medium hover:underline">
                    Upload photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <input
                    type="text" name="name" value={doctorForm.name}
                    onChange={handleDoctorChange} required placeholder="Dr. Juan dela Cruz"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email" name="email" value={doctorForm.email}
                    onChange={handleDoctorChange} required placeholder="doctor@example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password" name="password" value={doctorForm.password}
                  onChange={handleDoctorChange} required minLength={8} placeholder="Minimum 8 characters"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {/* Speciality & Degree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Field of expertise</label>
                  <select
                    name="speciality" value={doctorForm.speciality}
                    onChange={handleDoctorChange} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
                  >
                    <option value="">Select speciality</option>
                    {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree / Qualification</label>
                  <input
                    type="text" name="degree" value={doctorForm.degree}
                    onChange={handleDoctorChange} required placeholder="e.g. MD, MBBS"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Experience & Fees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Years of experience</label>
                  <select
                    name="experience" value={doctorForm.experience}
                    onChange={handleDoctorChange} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
                  >
                    <option value="">Select experience</option>
                    {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Consultation fee (₱)</label>
                  <input
                    type="number" name="fees" value={doctorForm.fees}
                    onChange={handleDoctorChange} required min={0} placeholder="e.g. 500"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">About / Bio</label>
                <textarea
                  name="about" value={doctorForm.about}
                  onChange={handleDoctorChange} required rows={3}
                  placeholder="Brief description of your background, expertise, and approach to patient care…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting application…' : 'Submit application'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link
              to={role === 'doctor' ? '/doctor/login' : '/login'}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
