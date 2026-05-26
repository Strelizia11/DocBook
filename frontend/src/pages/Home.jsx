import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/doctor/DoctorCard'

const specialities = [
  { name: 'General physician', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
  )},
  { name: 'Gynecologist', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  )},
  { name: 'Dermatologist', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>
  )},
  { name: 'Pediatricians', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>
  )},
  { name: 'Neurologist', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  )},
  { name: 'Gastroenterologist', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  )},
]

const STATUS_COLORS = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
}

/* Landing page for logged-out users */
const LandingHome = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const steps = [
    { n: '01', title: 'Create your account', desc: 'Sign up in under a minute — no paperwork required.' },
    { n: '02', title: 'Find a specialist', desc: 'Browse by speciality or search by name and read verified doctor profiles.' },
    { n: '03', title: 'Book your slot', desc: 'Pick a date and time that works for you, 24/7.' },
    { n: '04', title: 'Show up and get care', desc: 'Receive a confirmation, then just show up for your visit.' },
  ]

  const features = [
    {
      title: 'Find the Right Doctor',
      desc: 'Filter by speciality, availability, and fees.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: 'Instant Booking',
      desc: 'Real-time slot availability — no phone calls.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Appointment History',
      desc: 'All your visits tracked in one place.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: 'Stay Notified',
      desc: 'Confirmations so you never miss an appointment.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
  ]

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-secondary text-white py-24 px-4 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              Trusted across the Philippines
            </span>
            <h1 className="text-4xl md:text-6xl leading-tight mb-5" style={{ fontWeight: 500 }}>
              Your health,{' '}
              <br className="hidden md:block" />
              <span className="text-yellow-300">one click away.</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0" style={{ fontWeight: 400 }}>
              DOC.tify connects you with verified, licensed doctors — book appointments online in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-primary font-bold px-8 py-3.5 rounded-full hover:shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ fontWeight: 700 }}
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/doctors')}
                className="border-2 border-white/60 text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
                style={{ fontWeight: 600 }}
              >
                Browse Doctors &rarr;
              </button>
            </div>
          </div>

          {/* Stats card */}
          <div
            className="flex-shrink-0 text-center w-64"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px 24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              color: '#1e293b'
            }}
          >
            <p className="text-sm font-semibold mb-6" style={{ color: '#0EA5E9' }}>Platform at a Glance</p>
            <div className="space-y-5">
              {[['500+', 'Verified Doctors'], ['50k+', 'Appointments Booked'], ['6', 'Specialities']].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontSize: '36px', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{n}</p>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-slate-800" style={{ fontWeight: 500 }}>How it works</h2>
          <p className="text-slate-500 mt-2">Book an appointment in 4 simple steps.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-3 text-slate-200 text-xl z-10">&rarr;</div>
              )}
              <span className="text-3xl font-black text-primary/20">{s.n}</span>
              <h3 className="text-slate-800 mt-2 mb-1" style={{ fontWeight: 500 }}>{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialities */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl text-slate-800" style={{ fontWeight: 500 }}>Browse by Speciality</h2>
            <p className="text-slate-500 mt-2">Find the right specialist for your needs.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {specialities.map(s => (
              <div
                key={s.name}
                onClick={() => navigate(`/doctors/${s.name}`)}
                className="bg-white border border-slate-100 rounded-2xl p-4 text-center cursor-pointer hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                  {s.icon}
                </div>
                <p className="text-xs text-slate-700 leading-snug" style={{ fontWeight: 500 }}>{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why DOC.tify */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-slate-800" style={{ fontWeight: 500 }}>Why DOC.tify?</h2>
          <p className="text-slate-500 mt-2">Everything you need for a seamless healthcare experience.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="flex gap-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-50 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="text-slate-800 mb-1" style={{ fontWeight: 500 }}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Doctors preview */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl text-slate-800" style={{ fontWeight: 500 }}>Top Doctors</h2>
              <p className="text-slate-500 mt-1">Trusted by thousands of patients.</p>
            </div>
            <button onClick={() => navigate('/doctors')} className="text-primary text-sm hover:underline" style={{ fontWeight: 600 }}>
              View all &rarr;
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
              Create a free account to book &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Doctor CTA */}
      <section className="border-t border-slate-100 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl text-slate-800 mb-3" style={{ fontWeight: 500 }}>Are you a doctor?</h2>
          <p className="text-slate-500 mb-6">Join DOC.tify and manage your appointments digitally.</p>
          <button
            onClick={() => navigate('/doctor/login')}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-secondary transition-colors"
            style={{ fontWeight: 600 }}
          >
            Doctor Portal
          </button>
        </div>
      </section>
    </div>
  )
}

/* Dashboard for logged-in patients */
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
    {
      label: 'Find a Doctor',
      path: '/doctors',
      bg: '#EFF6FF',
      iconColor: '#0EA5E9',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      label: 'My Appointments',
      path: '/my-appointments',
      bg: '#F5F3FF',
      iconColor: '#7C3AED',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'My Profile',
      path: '/my-profile',
      bg: '#F0FDF4',
      iconColor: '#16A34A',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

      {/* Welcome banner */}
      <section className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-blue-200 text-sm mb-1" style={{ fontWeight: 500 }}>Welcome back</p>
          <h1 className="text-3xl" style={{ fontWeight: 500 }}>{firstName}!</h1>
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

      {/* Quick actions */}
      <section>
        <h2 className="text-lg text-slate-700 mb-4" style={{ fontWeight: 500 }}>Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map(a => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="bg-white border border-slate-100 rounded-2xl p-5 text-center hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: a.bg, color: a.iconColor }}
              >
                {a.icon}
              </div>
              <p className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{a.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Upcoming appointments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-slate-700" style={{ fontWeight: 500 }}>Upcoming Appointments</h2>
          <button onClick={() => navigate('/my-appointments')} className="text-primary text-sm hover:underline" style={{ fontWeight: 500 }}>
            View all &rarr;
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-7 h-7 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center">
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
              <div
                key={apt._id}
                className="bg-white border border-slate-100 shadow-sm p-4 flex items-center gap-4"
                style={{ borderRadius: '12px' }}
              >
                <img
                  src={apt.docData?.image}
                  alt={apt.docData?.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 truncate" style={{ fontWeight: 500 }}>{apt.docData?.name}</p>
                  <p className="text-sm text-primary">{apt.docData?.speciality}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {apt.slotDate?.replace(/_/g, '/')} &nbsp;&middot;&nbsp; {apt.slotTime}
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

      {/* Browse specialities */}
      <section>
        <h2 className="text-lg text-slate-700 mb-4" style={{ fontWeight: 500 }}>Browse by Speciality</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {specialities.map(s => (
            <div
              key={s.name}
              onClick={() => navigate(`/doctors/${s.name}`)}
              className="bg-white border border-slate-100 rounded-2xl p-3 text-center cursor-pointer hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="w-8 h-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center mx-auto mb-1">
                {s.icon}
              </div>
              <p className="text-xs text-slate-600 leading-snug" style={{ fontWeight: 500 }}>{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested doctors */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-lg text-slate-700" style={{ fontWeight: 500 }}>Doctors For You</h2>
          <button onClick={() => navigate('/doctors')} className="text-primary text-sm hover:underline" style={{ fontWeight: 500 }}>View all &rarr;</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {doctors.slice(0, 5).map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
        </div>
      </section>

    </div>
  )
}

/* Router */
const Home = () => {
  const { token } = useContext(AppContext)
  return token ? <Dashboard /> : <LandingHome />
}

export default Home