import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const DoctorProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { doctors, token } = useContext(AppContext)
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    const found = doctors.find(d => d._id === id)
    setDoctor(found || null)
  }, [id, doctors])

  if (!doctor) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center text-slate-400">
        <p className="text-5xl mb-3">👨‍⚕️</p>
        <p className="font-medium">Doctor not found</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-primary to-secondary h-32" />
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-6">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md"
            />
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-slate-800">{doctor.name}</h1>
              <p className="text-primary font-medium">{doctor.speciality}</p>
              <p className="text-slate-500 text-sm mt-0.5">{doctor.degree} · {doctor.experience} experience</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">₱{doctor.fees}</p>
              <p className="text-xs text-slate-500 mt-0.5">Consultation fee</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                <p className="text-base font-bold text-green-600">{doctor.available ? 'Available' : 'Unavailable'}</p>
              </div>
              <p className="text-xs text-slate-500">Status</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-base font-bold text-slate-700">{doctor.experience}</p>
              <p className="text-xs text-slate-500 mt-0.5">Experience</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-slate-800 mb-2">About</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{doctor.about}</p>
          </div>

          {(doctor.address?.line1 || doctor.address?.line2) && (
            <div className="mb-6">
              <h2 className="font-semibold text-slate-800 mb-2">Address</h2>
              <p className="text-slate-600 text-sm">{doctor.address.line1}</p>
              {doctor.address.line2 && <p className="text-slate-600 text-sm">{doctor.address.line2}</p>}
            </div>
          )}

          <button
            onClick={() => {
              if (!token) { navigate('/login'); return }
              navigate(`/book/${doctor._id}`)
            }}
            disabled={!doctor.available}
            className="w-full sm:w-auto bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {doctor.available ? 'Book Appointment' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
