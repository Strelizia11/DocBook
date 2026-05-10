import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import AdminSidebar from '../../components/admin/AdminSidebar'

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

const AdminDashboard = () => {
  const { aToken, backendUrl } = useContext(AdminContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!aToken) { navigate('/admin/login'); return }
    fetchDashboard()
  }, [aToken])

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { atoken: aToken }
      })
      if (data.success) setStats(data.dashData)
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const cancelAppointment = async id => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId: id },
        { headers: { atoken: aToken } }
      )
      if (data.success) { toast.success('Cancelled'); fetchDashboard() }
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
        <p className="text-slate-500 mb-8">Platform-wide overview</p>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Doctors', value: stats.doctors, icon: '👨‍⚕️', color: 'text-blue-600 bg-blue-50' },
                { label: 'Total Patients', value: stats.patients, icon: '👥', color: 'text-purple-600 bg-purple-50' },
                { label: 'Total Appointments', value: stats.appointments, icon: '📅', color: 'text-teal-600 bg-teal-50' },
                { label: 'Revenue', value: `₱${(stats.earnings || 0).toLocaleString()}`, icon: '💰', color: 'text-green-600 bg-green-50' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>{s.icon}</div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-slate-50">
                <h2 className="font-semibold text-slate-800">Latest Appointments</h2>
                <button onClick={() => navigate('/admin/appointments')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              {!stats.latestAppointments?.length ? (
                <p className="text-center text-slate-400 py-10 text-sm">No appointments yet</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {stats.latestAppointments.slice(0, 6).map(apt => (
                    <div key={apt._id} className="flex items-center gap-4 px-5 py-3.5">
                      <img src={apt.userData?.image || `https://ui-avatars.com/api/?name=${apt.userData?.name}&background=e2e8f0`} className="w-9 h-9 rounded-full object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{apt.userData?.name}</p>
                        <p className="text-xs text-slate-400">→ Dr. {apt.docData?.name} · {apt.slotDate?.replace(/_/g, '/')} {apt.slotTime}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
                        {apt.status || 'pending'}
                      </span>
                      {(apt.status === 'pending' || apt.status === 'confirmed') && !apt.cancelled && (
                        <button onClick={() => cancelAppointment(apt._id)} className="text-xs text-red-500 hover:underline ml-2">Cancel</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm">Failed to load dashboard.</p>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
