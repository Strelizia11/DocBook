import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import AdminSidebar from '../../components/admin/AdminSidebar'

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const AllAppointments = () => {
  const { aToken, backendUrl } = useContext(AdminContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!aToken) { navigate('/admin/login'); return }
    fetchAppointments()
  }, [aToken])

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { atoken: aToken }
      })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const cancelAppointment = async id => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId: id },
        { headers: { atoken: aToken } }
      )
      if (data.success) { toast.success('Cancelled'); fetchAppointments() }
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = appointments.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter
    const matchesSearch = search
      ? a.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.docData?.name?.toLowerCase().includes(search.toLowerCase())
      : true
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">All Appointments</h1>
        <p className="text-slate-500 mb-6">Manage all platform appointments</p>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patient or doctor…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                  filter === s ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 text-xs text-slate-400">
              Showing {filtered.length} of {appointments.length} appointments
            </div>
            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 py-16 text-sm">No appointments found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fee</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((apt, i) => (
                      <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3 text-xs text-slate-400">{i + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <img src={apt.userData?.image || `https://ui-avatars.com/api/?name=${apt.userData?.name}&background=e2e8f0`} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <span className="text-sm text-slate-700">{apt.userData?.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <img src={apt.docData?.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <div>
                              <p className="text-sm text-slate-700">{apt.docData?.name}</p>
                              <p className="text-xs text-slate-400">{apt.docData?.speciality}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          <p>{apt.slotDate?.replace(/_/g, '/')}</p>
                          <p className="text-xs text-slate-400">{apt.slotTime}</p>
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-slate-700">₱{apt.amount}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
                            {apt.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {(apt.status === 'pending' || apt.status === 'confirmed') && !apt.cancelled && (
                            <button
                              onClick={() => cancelAppointment(apt._id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default AllAppointments
