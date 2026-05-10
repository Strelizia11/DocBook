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
          <p className="text-5xl mb-3">🔒</p>
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

      <h1 className="text-2xl font-bold text-slate-800 mb-6">Book Appointment</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Doctor info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-xl object-cover mb-4" />
          <h2 className="font-bold text-slate-800 text-lg">{doctor.name}</h2>
          <p className="text-primary text-sm font-medium">{doctor.speciality}</p>
          <p className="text-slate-500 text-xs mt-0.5">{doctor.degree} · {doctor.experience}</p>
          <hr className="my-4 border-slate-100" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Consultation fee</span>
            <span className="font-bold text-slate-800">₱{doctor.fees}</span>
          </div>
        </div>

        {/* Slot picker */}
        <div className="md:col-span-2 space-y-6">
          {/* Date row */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-4">Select Date</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dates.map(d => {
                const isSelected = selectedDate && formatDate(d) === formatDate(selectedDate)
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                return (
                  <button
                    key={d.toDateString()}
                    onClick={() => { setSelectedDate(d); setSelectedTime(null) }}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all min-w-[64px] ${
                      isSelected
                        ? 'bg-primary border-primary text-white'
                        : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                    }`}
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
            <h3 className="font-semibold text-slate-700 mb-4">Select Time</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => {
                const isBooked = bookedSlots.includes(slot)
                const isSelected = selectedTime === slot
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                      isBooked
                        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                        : isSelected
                          ? 'bg-primary text-white border-primary'
                          : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                    }`}
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
              <p className="text-sm font-medium text-slate-700 mb-1">Appointment Summary</p>
              <p className="text-slate-600 text-sm">
                {selectedDate.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
              <p className="text-slate-500 text-sm">Fee: <span className="font-semibold text-slate-700">₱{doctor.fees}</span></p>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={!selectedDate || !selectedTime || loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking…' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
