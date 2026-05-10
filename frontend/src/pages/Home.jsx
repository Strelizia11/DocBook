import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/doctor/DoctorCard'

const specialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']

const Home = () => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Book Your Doctor <br /> Appointment Online
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-md">
              Find trusted doctors, check availability, and schedule your visit — all in one place.
            </p>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all"
            >
              Find Doctors →
            </button>
          </div>
          <div className="flex-1 hidden md:flex justify-center">
            <div className="w-72 h-72 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-8xl">🩺</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialities */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Browse by Speciality</h2>
        <p className="text-slate-500 mb-8">Find the right specialist for your health needs.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {specialities.map(s => (
            <div
              key={s}
              onClick={() => navigate(`/doctors/${s}`)}
              className="bg-white border border-slate-100 rounded-2xl p-4 text-center cursor-pointer hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="text-3xl mb-2">🏥</div>
              <p className="text-xs font-medium text-slate-700">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Doctors */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Top Doctors</h2>
            <p className="text-slate-500 mt-1">Trusted by thousands of patients.</p>
          </div>
          <button onClick={() => navigate('/doctors')} className="text-primary font-medium text-sm hover:underline">
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {doctors.slice(0, 10).map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-t border-primary/10 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Are you a doctor?</h2>
          <p className="text-slate-500 mb-6">Join DocBook and manage your appointments digitally.</p>
          <button onClick={() => navigate('/doctor/login')} className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary transition-colors">
            Doctor Portal
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home