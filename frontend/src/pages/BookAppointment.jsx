import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
]

const getDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push(d)
  }
  return dates
}

const formatDate = d =>
  `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`

const BookAppointment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { doctors, token, backendUrl, getDoctors } = useContext(AppContext)
  const [doctor, setDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [loading, setLoading] = useState(false)
  const dates = getDates()

  useEffect(() => {
    const found = doctors.find(d => d._id === id)
    setDoctor(found || null)
    setSelectedDate(dates[0])
  }, [id, doctors])

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="font-medium text-slate-800 mb-2">Login required</p>
          <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-medium">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  if (!doctor) return (
    <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
      <p>Doctor not found</p>
    </div>
  )

  const bookedSlots = doctor.slots_booked?.[selectedDate ? formatDate(selectedDate) : ''] || []
  const canConfirm = !!selectedDate && !!selectedTime && !loading

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      toast.warning('Please select a date and time slot')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId: id, slotDate: formatDate(selectedDate), slotTime: selectedTime },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Appointment booked!')
        getDoctors()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl text-slate-800 mb-6" style={{ fontWeight: 500 }}>Book Appointment</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Doctor info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
            <img src={doctor.image} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 className="text-slate-800 text-lg" style={{ fontWeight: 500 }}>{doctor.name}</h2>
          <p className="text-primary text-sm" style={{ fontWeight: 500 }}>{doctor.speciality}</p>
          <p className="text-slate-500 text-xs mt-0.5">{doctor.degree} &middot; {doctor.experience}</p>
          <hr className="my-4 border-slate-100" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Consultation fee</span>
            <span className="text-slate-800" style={{ fontWeight: 700 }}>&#8369;{doctor.fees}</span>
          </div>
        </div>

        {/* Slot picker */}
        <div className="md:col-span-2 space-y-6">
          {/* Date row */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-700 mb-4" style={{ fontWeight: 500 }}>Select Date</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dates.map(d => {
                const isSelected = selectedDate && formatDate(d) === formatDate(selectedDate)
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                return (
                  <button
                    key={d.toDateString()}
                    onClick={() => { setSelectedDate(d); setSelectedTime(null) }}
                    className="flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all min-w-[64px]"
                    style={isSelected
                      ? { background: '#0EA5E9', borderColor: '#0EA5E9', color: '#ffffff' }
                      : { background: '#ffffff', borderColor: '#e2e8f0', color: '#475569' }
                    }
                  >
                    <span className="text-xs font-medium">{dayNames[d.getDay()]}</span>
                    <span className="text-xl font-bold">{d.getDate()}</span>
                    <span className="text-xs">{monthNames[d.getMonth()]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-700 mb-4" style={{ fontWeight: 500 }}>Select Time</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = selectedTime === slot
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                    className="py-2 px-3 rounded-lg text-xs font-medium border transition-all"
                    style={
                      isBooked
                        ? { background: '#f8fafc', color: '#cbd5e1', borderColor: '#f1f5f9', cursor: 'not-allowed', textDecoration: 'line-through' }
                        : isSelected
                          ? { background: '#0EA5E9', color: '#ffffff', borderColor: '#0EA5E9' }
                          : { background: '#ffffff', color: '#475569', borderColor: '#e2e8f0' }
                    }
                    onMouseEnter={e => { if (!isBooked && !isSelected) e.currentTarget.style.background = '#EFF6FF' }}
                    onMouseLeave={e => { if (!isBooked && !isSelected) e.currentTarget.style.background = '#ffffff' }}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <p className="text-sm text-slate-700 mb-1" style={{ fontWeight: 500 }}>Appointment Summary</p>
              <p className="text-slate-600 text-sm">
                {selectedDate.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
              <p className="text-slate-500 text-sm">Fee: <span className="text-slate-700" style={{ fontWeight: 600 }}>&#8369;{doctor.fees}</span></p>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={!canConfirm}
            className="w-full text-white font-semibold py-3 rounded-xl transition-colors"
            style={canConfirm
              ? { background: '#0EA5E9', cursor: 'pointer' }
              : { background: '#CBD5E1', color: '#94A3B8', cursor: 'not-allowed' }
            }
          >
            {loading ? 'Booking…' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment