import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContext'
import DoctorSidebar from '../../components/doctor/DoctorSidebar'

const DoctorProfile = () => {
  const { dToken, backendUrl } = useContext(DoctorContext)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fees: '', about: '', available: true,
    address: { line1: '', line2: '' }
  })

  useEffect(() => {
    if (!dToken) { navigate('/doctor/login'); return }
    fetchProfile()
  }, [dToken])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { dtoken: dToken }
      })
      if (data.success) {
        setProfile(data.profileData)
        setForm({
          fees: data.profileData.fees || '',
          about: data.profileData.about || '',
          available: data.profileData.available ?? true,
          address: {
            line1: data.profileData.address?.line1 || '',
            line2: data.profileData.address?.line2 || '',
          }
        })
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    if (name === 'line1' || name === 'line2') {
      setForm(f => ({ ...f, address: { ...f.address, [name]: value } }))
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        { fees: form.fees, about: form.about, available: form.available, address: form.address },
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        toast.success('Profile updated')
        fetchProfile()
        setEditing(false)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">My Profile</h1>
        <p className="text-slate-500 mb-8">Manage your public information</p>

        {!profile ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-5 mb-8">
                <img src={profile.image} alt={profile.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100" />
                <div>
                  <h2 className="font-bold text-slate-800 text-lg">{profile.name}</h2>
                  <p className="text-primary text-sm">{profile.speciality}</p>
                  <p className="text-slate-400 text-xs">{profile.degree} · {profile.experience}</p>
                </div>
              </div>

              {/* Availability toggle */}
              <div className="mb-6 flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Availability</p>
                  <p className="text-xs text-slate-500">Patients can book when enabled</p>
                </div>
                {editing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow" />
                  </label>
                ) : (
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${profile.available ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {profile.available ? 'Available' : 'Unavailable'}
                  </span>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Consultation Fee (₱)</label>
                  {editing ? (
                    <input
                      type="number"
                      name="fees"
                      value={form.fees}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                  ) : (
                    <p className="text-slate-800 text-sm py-2.5 font-semibold">₱{profile.fees}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">About</label>
                  {editing ? (
                    <textarea
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed">{profile.about || '—'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Address Line 1</label>
                  {editing ? (
                    <input type="text" name="line1" value={form.address.line1} onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  ) : (
                    <p className="text-slate-600 text-sm py-2.5">{profile.address?.line1 || '—'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Address Line 2</label>
                  {editing ? (
                    <input type="text" name="line2" value={form.address.line2} onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  ) : (
                    <p className="text-slate-600 text-sm py-2.5">{profile.address?.line2 || '—'}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={loading}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-60">
                      {loading ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditing(false)}
                      className="border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorProfile
