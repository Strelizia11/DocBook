import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/appointments', label: 'Appointments', icon: '📅' },
  { to: '/admin/doctors', label: 'Doctors', icon: '👨‍⚕️' },
  { to: '/admin/add-doctor', label: 'Add Doctor', icon: '➕' },
]

const AdminSidebar = () => {
  const { setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  const logout = () => {
    setAToken('')
    localStorage.removeItem('aToken')
    navigate('/admin/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-100 flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white text-sm">⚙️</div>
          <span className="font-bold text-slate-800">DocBook</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
