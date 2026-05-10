import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContext'
import DoctorSidebar from '../../components/doctor/DoctorSidebar'

const DoctorDashboard = () => {
  const { dToken, backendUrl } = useContext(DoctorContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!dToken) { navigate('/doctor/login'); return }
    fetchDashboard()
  }, [dToken])

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { dtoken: dToken }
      })
      if (data.success) setStats(data.dashData)
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const STATUS_COLORS = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-600',
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-500 mb-8">Welcome back, Doctor</p>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : stats ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Appointments', value: stats.appointments, icon: '📅', color: 'text-blue-600 bg-blue-50' },
                { label: 'Patients', value: stats.patients, icon: '👥', color: 'text-purple-600 bg-purple-50' },
                { label: 'Earnings', value: `₱${stats.earnings?.toLocaleString() || 0}`, icon: '💰', color: 'text-green-600 bg-green-50' },
                { label: 'Completed', value: stats.latestAppointments?.filter(a => a.status === 'completed').length || 0, icon: '✅', color: 'text-teal-600 bg-teal-50' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Latest Appointments */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-slate-50">
                <h2 className="font-semibold text-slate-800">Latest Appointments</h2>
                <button onClick={() => navigate('/doctor/appointments')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              {stats.latestAppointments?.length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-sm">No appointments yet</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {stats.latestAppointments?.slice(0, 5).map(apt => (
                    <div key={apt._id} className="flex items-center gap-4 p-4">
                      <img src={apt.userData?.image || `https://ui-avatars.com/api/?name=${apt.userData?.name}&background=e2e8f0`} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">{apt.userData?.name}</p>
                        <p className="text-xs text-slate-500">{apt.slotDate?.replace(/_/g, '/')} · {apt.slotTime}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
                        {apt.status || 'pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm">Failed to load dashboard data.</p>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard
