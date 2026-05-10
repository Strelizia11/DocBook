import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import AdminSidebar from '../../components/admin/AdminSidebar'

const specialities = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist'
]

const AddDoctor = () => {
  const { aToken, backendUrl } = useContext(AdminContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    speciality: specialities[0],
    degree: '', experience: '', about: '',
    fees: '', address: { line1: '', line2: '' }
  })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    if (!aToken) navigate('/admin/login')
  }, [aToken])

  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'line1' || name === 'line2') {
      setForm(f => ({ ...f, address: { ...f.address, [name]: value } }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!imageFile) { toast.warning('Please upload a doctor photo'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'address') fd.append(k, JSON.stringify(v))
        else fd.append(k, v)
      })
      fd.append('image', imageFile)

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, fd, {
        headers: { atoken: aToken }
      })
      if (data.success) {
        toast.success('Doctor added successfully!')
        navigate('/admin/doctors')
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
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Add Doctor</h1>
        <p className="text-slate-500 mb-8">Register a new doctor on the platform</p>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-5">
            {/* Image upload */}
            <div className="flex items-center gap-5">
              <label className="cursor-pointer">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-primary transition-colors bg-slate-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl">📷</p>
                      <p className="text-xs text-slate-400 mt-1">Upload</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
              <div>
                <p className="font-medium text-slate-700 text-sm">Doctor Photo</p>
                <p className="text-xs text-slate-400 mt-0.5">JPG, PNG up to 5MB</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Dr. Juan Santos' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'doctor@example.com' },
                { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 8 characters' },
                { label: 'Degree', name: 'degree', type: 'text', placeholder: 'MD, FPCP' },
                { label: 'Experience', name: 'experience', type: 'text', placeholder: '5 Years' },
                { label: 'Consultation Fee (₱)', name: 'fees', type: 'number', placeholder: '500' },
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Speciality</label>
                <select
                  name="speciality"
                  value={form.speciality}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                >
                  {specialities.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address Line 1</label>
                <input
                  type="text"
                  name="line1"
                  value={form.address.line1}
                  onChange={handleChange}
                  placeholder="Clinic address"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Address Line 2</label>
                <input
                  type="text"
                  name="line2"
                  value={form.address.line2}
                  onChange={handleChange}
                  placeholder="City, Province"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">About</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Brief professional bio…"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Adding Doctor…' : 'Add Doctor'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/doctors')}
                className="border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddDoctor
