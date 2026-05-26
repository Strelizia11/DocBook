import { useNavigate } from 'react-router-dom'

const SPECIALTY_BADGE = {
  'General physician': 'bg-teal-50 text-teal-700',
  'Gynecologist': 'bg-pink-50 text-pink-700',
  'Dermatologist': 'bg-orange-50 text-orange-700',
  'Pediatricians': 'bg-yellow-50 text-yellow-700',
  'Neurologist': 'bg-purple-50 text-purple-700',
  'Gastroenterologist': 'bg-blue-50 text-blue-700',
}

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()
  const badgeClass = SPECIALTY_BADGE[doctor.speciality] || 'bg-slate-100 text-slate-600'

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 cursor-pointer transition-all duration-200"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
      onClick={() => navigate(`/book/${doctor._id}`)}
    >
      <div className="overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <img
          src={doctor.image}
          alt={doctor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
          <span className="text-xs text-green-600 font-medium">Available</span>
          <span className="ml-auto text-xs text-amber-500 font-medium">&#9733; 4.8</span>
        </div>
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${badgeClass}`}>
          {doctor.speciality}
        </span>
        <h3 className="font-500 text-slate-800 font-semibold leading-snug">{doctor.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">5+ yrs experience</p>
        <p className="text-sm font-semibold text-primary mt-1">&#8369;{doctor.fees} / visit</p>
        <button
          onClick={e => { e.stopPropagation(); navigate(`/book/${doctor._id}`) }}
          className="mt-3 w-full bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

export default DoctorCard