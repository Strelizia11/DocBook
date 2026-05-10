import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const MyProfile = () => {
  const { token, backendUrl, userData, loadUserData } = useContext(AppContext)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [form, setForm] = useState({
    name: '', phone: '', dob: '', gender: 'Not Selected',
    address: { line1: '', line2: '' }
  })

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    if (userData) {
      setForm({
        name: userData.name || '',
        phone: userData.phone || '',
        dob: userData.dob || '',
        gender: userData.gender || 'Not Selected',
        address: { line1: userData.address?.line1 || '', line2: userData.address?.line2 || '' }
      })
    }
  }, [userData, token])

  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'line1' || name === 'line2') {
      setForm(f => ({ ...f, address: { ...f.address, [name]: value } }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('phone', form.phone)
      fd.append('dob', form.dob)
      fd.append('gender', form.gender)
      fd.append('address', JSON.stringify(form.address))
      if (imageFile) fd.append('image', imageFile)

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, fd, {
        headers: { token }
      })
      if (data.success) {
        toast.success('Profile updated')
        loadUserData()
        setEditing(false)
        setImageFile(null)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
    setLoading(false)
  }

  if (!userData) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : userData.image

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <img
              src={previewUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0ea5e9&color=fff`}
              alt="avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100"
            />
            {editing && (
              <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
              </label>
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-lg">{userData.name}</p>
            <p className="text-slate-500 text-sm">{userData.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { label: 'Full name', name: 'name', type: 'text' },
            { label: 'Phone', name: 'phone', type: 'tel' },
            { label: 'Date of Birth', name: 'dob', type: 'date' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              {editing ? (
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              ) : (
                <p className="text-slate-800 text-sm py-2.5">{userData[f.name] || <span className="text-slate-400">—</span>}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Gender</label>
            {editing ? (
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option>Not Selected</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            ) : (
              <p className="text-slate-800 text-sm py-2.5">{userData.gender || '—'}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Address Line 1</label>
            {editing ? (
              <input
                type="text"
                name="line1"
                value={form.address.line1}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            ) : (
              <p className="text-slate-800 text-sm py-2.5">{userData.address?.line1 || <span className="text-slate-400">—</span>}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Address Line 2</label>
            {editing ? (
              <input
                type="text"
                name="line2"
                value={form.address.line2}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            ) : (
              <p className="text-slate-800 text-sm py-2.5">{userData.address?.line2 || <span className="text-slate-400">—</span>}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(false); setImageFile(null) }}
                className="border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProfile
