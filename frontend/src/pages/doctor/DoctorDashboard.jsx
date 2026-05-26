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

/* Simple SVG line chart */
const LineChart = ({ data }) => {
  if (!data || data.length === 0) return null
  const W = 520, H = 120, PAD = 20
  const max = Math.max(...data.map(d => d.count), 1)
  const xs = data.map((_, i) => PAD + (i / (data.length - 1)) * (W - PAD * 2))
  const ys = data.map(d => PAD + (1 - d.count / max) * (H - PAD * 2))
  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')
  const areaPath = `${linePath} L${xs[xs.length - 1]},${H - PAD} L${xs[0]},${H - PAD} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '120px' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="#0EA5E9" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.label}</text>
      ))}
    </svg>
  )
}

const buildChartData = (appointments) => {
  const days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`
    const label = d.toLocaleDateString('en-PH', { weekday: 'short' }).slice(0, 2)
    const count = (appointments || []).filter(a => a.slotDate === key).length
    days.push({ label, count })
  }
  return days
}

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

  const statCards = stats ? [
    {
      label: 'Total Appointments',
      value: stats.appointments,
      bg: '#EFF6FF', color: '#1D4ED8',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Patients',
      value: stats.patients,
      bg: '#F5F3FF', color: '#6D28D9',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Earnings',
      value: `\u20B1${(stats.earnings || 0).toLocaleString()}`,
      bg: '#F0FDF4', color: '#15803D',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Completed',
      value: stats.latestAppointments?.filter(a => a.status === 'completed').length || 0,
      bg: '#F0FDFA', color: '#0F766E',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ] : []

  const chartData = stats ? buildChartData(stats.latestAppointments) : []

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl text-slate-800 mb-1" style={{ fontWeight: 500 }}>Dashboard</h1>
        <p className="text-slate-500 mb-8">Welcome back, Doctor</p>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {s.icon}
                  </div>
                  <p className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>{s.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Appointment volume chart */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
              <h2 className="text-slate-800 mb-1" style={{ fontWeight: 500 }}>Appointment Volume</h2>
              <p className="text-xs text-slate-400 mb-4">Past 7 days</p>
              <LineChart data={chartData} />
            </div>

            {/* Latest appointments */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #F8FAFC' }}>
                <h2 className="text-slate-800" style={{ fontWeight: 500 }}>Latest Appointments</h2>
                <button onClick={() => navigate('/doctor/appointments')} className="text-xs text-primary hover:underline" style={{ fontWeight: 500 }}>View all</button>
              </div>
              {stats.latestAppointments?.length === 0 ? (
                <p className="text-center text-slate-400 py-10 text-sm">No appointments yet</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {stats.latestAppointments?.slice(0, 5).map(apt => (
                    <div key={apt._id} className="flex items-center gap-4 p-4">
                      <img
                        src={apt.userData?.image || `https://ui-avatars.com/api/?name=${apt.userData?.name}&background=e2e8f0`}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-sm truncate" style={{ fontWeight: 500 }}>{apt.userData?.name}</p>
                        <p className="text-xs text-slate-500">{apt.slotDate?.replace(/_/g, '/')} &middot; {apt.slotTime}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
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