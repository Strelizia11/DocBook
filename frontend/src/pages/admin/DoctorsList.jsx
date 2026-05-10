import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import AdminSidebar from '../../components/admin/AdminSidebar'

const DoctorsList = () => {
  const { aToken, backendUrl } = useContext(AdminContext)
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!aToken) { navigate('/admin/login'); return }
    fetchDoctors()
  }, [aToken])

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { atoken: aToken }
      })
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  const toggleApproval = async (id, currentApproval) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/approve-doctor`,
        { docId: id, approved: !currentApproval },
        { headers: { atoken: aToken } }
      )
      if (data.success) {
        toast.success(`Doctor ${!currentApproval ? 'approved' : 'suspended'}`)
        fetchDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = doctors.filter(d =>
    search
      ? d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.speciality.toLowerCase().includes(search.toLowerCase())
      : true
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-800">All Doctors</h1>
          <button
            onClick={() => navigate('/admin/add-doctor')}
            className="bg-slate-800 text-white text-sm px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors font-medium"
          >
            + Add Doctor
          </button>
        </div>
        <p className="text-slate-500 mb-6">Manage registered doctors</p>

        <div className="relative mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or speciality…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-sm pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(doc => (
              <div key={doc._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-slate-50 h-36 overflow-hidden">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{doc.name}</h3>
                    <span className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${doc.available ? 'bg-green-400' : 'bg-slate-300'}`} />
                  </div>
                  <p className="text-xs text-primary mb-0.5">{doc.speciality}</p>
                  <p className="text-xs text-slate-400">{doc.degree} · {doc.experience}</p>
                  <p className="text-xs font-semibold text-slate-700 mt-2">₱{doc.fees}/visit</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${doc.approved ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'}`}>
                      {doc.approved ? 'Approved' : 'Pending'}
                    </span>
                    <button
                      onClick={() => toggleApproval(doc._id, doc.approved)}
                      className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                        doc.approved
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {doc.approved ? 'Suspend' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-slate-400">
                <p className="text-4xl mb-3">👨‍⚕️</p>
                <p>No doctors found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorsList
