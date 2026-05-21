import { useState } from 'react'
import { toast } from 'react-toastify'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    // In a real app, POST to backend
    setSent(true)
    toast.success("Message sent! We'll get back to you within 24 hours.")
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-100 text-lg">Have questions? We're here to help.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Get in Touch</h2>
            <div className="space-y-5">
              {[
                { icon: '📍', label: 'Address', value: '123 Health Ave, Makati City, Metro Manila, Philippines' },
                { icon: '📞', label: 'Phone', value: '+63 2 8123 4567' },
                { icon: '✉️', label: 'Email', value: 'hello@DOC.tify.ph' },
                { icon: '⏰', label: 'Support Hours', value: 'Mon–Fri, 8:00 AM – 6:00 PM' },
              ].map(c => (
                <div key={c.label} className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{c.label}</p>
                    <p className="text-slate-700 text-sm mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <h3 className="font-semibold text-slate-800 mb-2">For Doctors</h3>
              <p className="text-slate-500 text-sm">
                Interested in joining DOC.tify as a healthcare provider? Reach out to{' '}
                <a href="mailto:doctors@DOC.tify.ph" className="text-primary hover:underline">doctors@DOC.tify.ph</a>
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm mb-6">We'll respond within 24 hours.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="text-primary font-medium text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Send a Message</h2>

                {[
                  { label: 'Your name', name: 'name', type: 'text', placeholder: 'Juan dela Cruz' },
                  { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@example.com' },
                  { label: 'Subject', name: 'subject', type: 'text', placeholder: 'How can we help?' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      required
                      placeholder={f.placeholder}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us more about your concern…"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
