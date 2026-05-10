import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/doctor/DoctorCard'

const specialities = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist'
]

const DoctorList = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [search, setSearch] = useState('')
  const [selectedSpec, setSelectedSpec] = useState(speciality || '')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  useEffect(() => {
    setSelectedSpec(speciality || '')
  }, [speciality])

  const filtered = doctors.filter(doc => {
    const matchesSpec = selectedSpec ? doc.speciality === selectedSpec : true
    const matchesSearch = search
      ? doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(search.toLowerCase())
      : true
    const matchesAvailable = showAvailableOnly ? doc.available : true
    return matchesSpec && matchesSearch && matchesAvailable
  })

  const handleSpec = spec => {
    if (selectedSpec === spec) {
      setSelectedSpec('')
      navigate('/doctors')
    } else {
      setSelectedSpec(spec)
      navigate(`/doctors/${spec}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Find a Doctor</h1>
        <p className="text-slate-500 mt-1">Browse and book appointments with top specialists</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or speciality…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sticky top-24">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Speciality</h2>
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedSpec(''); navigate('/doctors') }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${!selectedSpec ? 'bg-primary text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                All Specialities
              </button>
              {specialities.map(s => (
                <button
                  key={s}
                  onClick={() => handleSpec(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedSpec === s ? 'bg-primary text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <hr className="my-4 border-slate-100" />
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={e => setShowAvailableOnly(e.target.checked)}
                className="rounded text-primary"
              />
              Available only
            </label>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
              {selectedSpec ? ` in ${selectedSpec}` : ''}
            </p>
            {(selectedSpec || search || showAvailableOnly) && (
              <button
                onClick={() => { setSelectedSpec(''); setSearch(''); setShowAvailableOnly(false); navigate('/doctors') }}
                className="text-xs text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-5xl mb-3">🔍</p>
              <p className="font-medium">No doctors found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorList
