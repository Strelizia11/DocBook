import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContext'
import DoctorSidebar from '../../components/doctor/DoctorSidebar'

const STATUS_COLORS = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const DoctorAppointments = () => {
  const { dToken, backendUrl } = useContext(DoctorContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!dToken) { navigate('/doctor/login'); return }
    fetchAppointments()
  }, [dToken])

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dtoken: dToken }
      })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const updateStatus = async (id, action) => {
    try {
      const endpoint = action === 'complete'
        ? `${backendUrl}/api/doctor/complete-appointment`
        : `${backendUrl}/api/doctor/cancel-appointment`
      const { data } = await axios.post(endpoint, { appointmentId: id }, { headers: { dtoken: dToken } })
      if (data.success) {
        toast.success(`Appointment ${action === 'complete' ? 'completed' : 'cancelled'}`)
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl text-slate-800 mb-1" style={{ fontWeight: 500 }}>Appointments</h1>
        <p className="text-slate-500 mb-6">Manage your patient appointments</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-4 py-1.5 rounded-full text-sm capitalize transition-all"
              style={filter === s
                ? { background: '#0EA5E9', color: '#ffffff', fontWeight: 600 }
                : { background: '#ffffff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 500 }
              }
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p>No appointments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(apt => (
              <div
                key={apt._id}
                className="bg-white border border-slate-100 shadow-sm"
                style={{ borderRadius: '12px', padding: '16px' }}
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Patient */}
                  <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                    <img
                      src={apt.userData?.image || `https://ui-avatars.com/api/?name=${apt.userData?.name}&background=e2e8f0`}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{apt.userData?.name}</p>
                      <p className="text-xs text-slate-400">{apt.userData?.gender} &middot; {apt.userData?.dob}</p>
                    </div>
                  </div>

                  {/* Date & time */}
                  <div className="min-w-[120px]">
                    <p className="text-sm text-slate-600">{apt.slotDate?.replace(/_/g, '/')}</p>
                    <p className="text-xs text-slate-400">{apt.slotTime}</p>
                  </div>

                  {/* Amount */}
                  <div className="min-w-[80px]">
                    <p className="text-sm text-slate-700" style={{ fontWeight: 500 }}>&#8369;{apt.amount}</p>
                  </div>

                  {/* Status */}
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
                    {apt.status || 'pending'}
                  </span>

                  {/* Actions */}
                  {(apt.status === 'pending' || apt.status === 'confirmed') && !apt.cancelled && (
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => updateStatus(apt._id, 'complete')}
                        className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateStatus(apt._id, 'cancel')}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorAppointments