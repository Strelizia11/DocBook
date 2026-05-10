import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/book/${doctor._id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="bg-blue-50 h-48 flex items-center justify-center overflow-hidden">
        <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span className="text-xs text-green-600 font-medium">Available</span>
        </div>
        <h3 className="font-semibold text-slate-800">{doctor.name}</h3>
        <p className="text-sm text-slate-500 mt-0.5">{doctor.speciality}</p>
        <p className="text-sm font-medium text-primary mt-2">₱{doctor.fees} / visit</p>
      </div>
    </div>
  )
}

export default DoctorCard