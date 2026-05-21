import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  const features = [
    { icon: '🔍', title: 'Find the Right Doctor', desc: 'Search by speciality, location, or name and read verified profiles.' },
    { icon: '📅', title: 'Instant Booking', desc: 'Book appointments 24/7 with real-time slot availability — no phone calls needed.' },
    { icon: '🔔', title: 'Stay Updated', desc: 'Get confirmations and reminders so you never miss an appointment.' },
    { icon: '📋', title: 'Health Records', desc: 'Keep your appointment history in one convenient place.' },
  ]

  const team = [
    { name: 'Dr. Maria Santos', role: 'Chief Medical Officer', emoji: '👩‍⚕️' },
    { name: 'Juan Reyes', role: 'Head of Engineering', emoji: '👨‍💻' },
    { name: 'Anna Garcia', role: 'Product Designer', emoji: '👩‍🎨' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About DOC.tify</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            We're on a mission to make healthcare more accessible — connecting patients with trusted doctors across the Philippines.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              DOC.tify was built to eliminate the friction between patients and healthcare. We believe that booking a doctor's appointment should be as simple as ordering food online.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Founded by a team of healthcare and technology professionals, we partner with verified, licensed physicians to bring you a trusted platform where health comes first.
            </p>
          </div>
          <div className="bg-primary/5 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🏥</div>
            <p className="text-3xl font-bold text-primary mb-1">500+</p>
            <p className="text-slate-500 mb-4">Verified Doctors</p>
            <p className="text-3xl font-bold text-primary mb-1">50,000+</p>
            <p className="text-slate-500">Appointments Booked</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Why DOC.tify?</h2>
          <p className="text-slate-500 text-center mb-10">Everything you need for a seamless healthcare experience</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Our Team</h2>
        <p className="text-slate-500 text-center mb-10">Passionate people building better healthcare</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.map(m => (
            <div key={m.name} className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm">
              <div className="text-5xl mb-3">{m.emoji}</div>
              <h3 className="font-semibold text-slate-800">{m.name}</h3>
              <p className="text-slate-500 text-sm mt-0.5">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-t border-primary/10 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Ready to get started?</h2>
        <p className="text-slate-500 mb-6">Find a doctor and book your first appointment today.</p>
        <button onClick={() => navigate('/doctors')} className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary transition-colors">
          Browse Doctors
        </button>
      </section>
    </div>
  )
}

export default About
