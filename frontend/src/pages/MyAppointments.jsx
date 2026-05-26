import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const STATUS_COLORS = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const MyAppointments = () => {
  const { token, backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      })
      if (data.success) setAppointments(data.appointments.reverse())
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const cancelAppointment = async id => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId: id },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Appointment cancelled')
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchAppointments()
  }, [token])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl text-slate-800 mb-2" style={{ fontWeight: 500 }}>My Appointments</h1>
      <p className="text-slate-500 mb-8">Track and manage your upcoming visits</p>

      {appointments.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="font-medium">No appointments yet</p>
          <button
            onClick={() => navigate('/doctors')}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium"
          >
            Find a Doctor
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(apt => (
            <div
              key={apt._id}
              className="bg-white border border-slate-100 shadow-sm overflow-hidden"
              style={{ borderRadius: '12px', padding: '16px' }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={apt.docData?.image}
                    alt={apt.docData?.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-slate-800" style={{ fontWeight: 500 }}>{apt.docData?.name}</h3>
                      <p className="text-sm text-primary" style={{ fontWeight: 500 }}>{apt.docData?.speciality}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {apt.slotDate?.replace(/_/g, '/')} &nbsp;&middot;&nbsp; {apt.slotTime}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
                        {apt.status || 'pending'}
                      </span>
                      <span className="text-xs text-slate-500">&#8369;{apt.amount}</span>
                    </div>
                  </div>

                  {(apt.status === 'pending' || apt.status === 'confirmed') && !apt.cancelled && (
                    <button
                      onClick={() => cancelAppointment(apt._id)}
                      className="mt-3 text-xs text-red-500 hover:underline"
                    >
                      Cancel appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments