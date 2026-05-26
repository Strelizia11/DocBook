import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/doctor/DoctorCard'

const specialities = [
  { name: 'General physician', icon: '🩺' },
  { name: 'Gynecologist', icon: '👩‍⚕️' },
  { name: 'Dermatologist', icon: '🧴' },
  { name: 'Pediatricians', icon: '👶' },
  { name: 'Neurologist', icon: '🧠' },
  { name: 'Gastroenterologist', icon: '🫀' },
]

const STATUS_COLORS = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
}

/* ─── Logged-out landing page ─────────────────────────────────────────────── */
const LandingHome = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const steps = [
    { n: '01', title: 'Create your account', desc: 'Sign up in under a minute — no paperwork required.' },
    { n: '02', title: 'Find a specialist', desc: 'Browse by speciality or search by name and read verified doctor profiles.' },
    { n: '03', title: 'Book your slot', desc: 'Pick a date and time that works for you, 24 / 7.' },
    { n: '04', title: 'Show up & get care', desc: 'Receive a confirmation, then just show up for your visit.' },
  ]

  const features = [
    { icon: '🔍', title: 'Find the Right Doctor', desc: 'Filter by speciality, availability, and fees.' },
    { icon: '📅', title: 'Instant Booking', desc: 'Real-time slot availability — no phone calls.' },
    { icon: '📋', title: 'Appointment History', desc: 'All your visits tracked in one place.' },
    { icon: '🔔', title: 'Stay Notified', desc: 'Confirmations so you never miss an appointment.' },
  ]

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary text-white py-24 px-4 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              🇵🇭 Trusted across the Philippines
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              Your health, <br className="hidden md:block"/>
              <span className="text-yellow-300">one click away.</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0">
              DOC.tify connects you with verified, licensed doctors — book appointments online in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-primary font-bold px-8 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/doctors')}
                className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
              >
                Browse Doctors →
              </button>
            </div>
          </div>

          {/* Stats card */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center w-64">
            <div className="text-5xl mb-2">🩺</div>
            <div className="space-y-4 mt-4">
              {[['500+', 'Verified Doctors'], ['50k+', 'Appointments Booked'], ['6', 'Specialities']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-2xl font-extrabold">{n}</p>
                  <p className="text-blue-200 text-xs">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800">How it works</h2>
          <p className="text-slate-500 mt-2">Book an appointment in 4 simple steps.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-3 text-slate-200 text-xl z-10">→</div>
              )}
              <span className="text-3xl font-black text-primary/20">{s.n}</span>
              <h3 className="font-bold text-slate-800 mt-2 mb-1">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Specialities ── */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800">Browse by Speciality</h2>
            <p className="text-slate-500 mt-2">Find the right specialist for your needs.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {specialities.map(s => (
              <div
                key={s.name}
                onClick={() => navigate(`/doctors/${s.name}`)}
                className="bg-white border border-slate-100 rounded-2xl p-4 text-center cursor-pointer hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-xs font-semibold text-slate-700 leading-snug">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why DOC.tify ── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-800">Why DOC.tify?</h2>
          <p className="text-slate-500 mt-2">Everything you need for a seamless healthcare experience.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="flex gap-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl flex-shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Top Doctors preview ── */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-800">Top Doctors</h2>
              <p className="text-slate-500 mt-1">Trusted by thousands of patients.</p>
            </div>
            <button onClick={() => navigate('/doctors')} className="text-primary font-semibold text-sm hover:underline">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {doctors.slice(0, 5).map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-primary text-white font-bold px-10 py-3.5 rounded-full hover:bg-secondary transition-colors shadow-md hover:shadow-lg"
            >
              Create a free account to book →
            </button>
          </div>
        </div>
      </section>

      {/* ── Doctor CTA ── */}
      <section className="border-t border-slate-100 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Are you a doctor?</h2>
          <p className="text-slate-500 mb-6">Join DOC.tify and manage your appointments digitally.</p>
          <button
            onClick={() => navigate('/doctor/login')}
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary transition-colors"
          >
            Doctor Portal
          </button>
        </div>
      </section>
    </div>
  )
}

/* ─── Logged-in dashboard ─────────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate()
  const { token, userData, backendUrl, doctors } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
        if (data.success) setAppointments(data.appointments.reverse())
      } catch (err) {
        toast.error(err.message)
      }
      setLoading(false)
    }
    fetchAppointments()
  }, [token])

  const upcoming = appointments.filter(a => !a.cancelled && a.status !== 'completed').slice(0, 3)
  const firstName = userData?.name?.split(' ')[0] || 'there'

  const quickActions = [
    { icon: '🔍', label: 'Find a Doctor', path: '/doctors' },
    { icon: '📅', label: 'My Appointments', path: '/my-appointments' },
    { icon: '👤', label: 'My Profile', path: '/my-profile' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

      {/* ── Welcome banner ── */}
      <section className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-blue-200 text-sm font-medium mb-1">Welcome back 👋</p>
          <h1 className="text-3xl font-extrabold">{firstName}!</h1>
          <p className="text-blue-100 mt-1">
            {upcoming.length > 0
              ? `You have ${upcoming.length} upcoming appointment${upcoming.length > 1 ? 's' : ''}.`
              : 'No upcoming appointments. Book one today!'}
          </p>
        </div>
        <button
          onClick={() => navigate('/doctors')}
          className="flex-shrink-0 bg-white text-primary font-bold px-7 py-3 rounded-full hover:shadow-lg transition-all"
        >
          + Book Appointment
        </button>
      </section>

      {/* ── Quick actions ── */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map(a => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="bg-white border border-slate-100 rounded-2xl p-5 text-center hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="text-sm font-semibold text-slate-700">{a.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Upcoming appointments ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-700">Upcoming Appointments</h2>
          <button onClick={() => navigate('/my-appointments')} className="text-primary text-sm font-medium hover:underline">
            View all →
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-7 h-7 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-4xl mb-2">📅</p>
            <p className="text-slate-500 font-medium">No upcoming appointments</p>
            <button
              onClick={() => navigate('/doctors')}
              className="mt-4 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-secondary transition-colors"
            >
              Find a Doctor
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(apt => (
              <div key={apt._id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex items-center gap-4">
                <img
                  src={apt.docData?.image}
                  alt={apt.docData?.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{apt.docData?.name}</p>
                  <p className="text-sm text-primary">{apt.docData?.speciality}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    📅 {apt.slotDate?.replace(/_/g, '/')} &nbsp;·&nbsp; 🕐 {apt.slotTime}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize flex-shrink-0 ${STATUS_COLORS[apt.status] || STATUS_COLORS.pending}`}>
                  {apt.status || 'pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Browse specialities ── */}
      <section>
        <h2 className="text-lg font-bold text-slate-700 mb-4">Browse by Speciality</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {specialities.map(s => (
            <div
              key={s.name}
              onClick={() => navigate(`/doctors/${s.name}`)}
              className="bg-white border border-slate-100 rounded-2xl p-3 text-center cursor-pointer hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="text-xs font-medium text-slate-600 leading-snug">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Suggested doctors ── */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-700">Doctors For You</h2>
          <button onClick={() => navigate('/doctors')} className="text-primary text-sm font-medium hover:underline">View all →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {doctors.slice(0, 5).map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
        </div>
      </section>

    </div>
  )
}

/* ─── Router ──────────────────────────────────────────────────────────────── */
const Home = () => {
  const { token } = useContext(AppContext)
  return token ? <Dashboard /> : <LandingHome />
}

export default Home