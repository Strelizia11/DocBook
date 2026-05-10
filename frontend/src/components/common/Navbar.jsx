import { useContext, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import defaultAvatar from '../../assets/image.png'

// then in the img tag:


const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
    setMenuOpen(false)
    navigate('/')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Doc<span className="text-slate-700">Book</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/doctors" className="hover:text-primary transition-colors">Doctors</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {token && userData ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setMenuOpen(prev => !prev)}
              >
                <img
                  src={userData.image || defaultAvatar}
                  className="w-9 h-9 rounded-full object-cover border-2 border-primary/20"
                  alt="profile"
                />
                <span className="text-sm font-medium text-slate-700 hidden md:block">{userData.name}</span>
                <span className="text-slate-400 text-xs">{menuOpen ? '▴' : '▾'}</span>
              </div>

              {menuOpen && (
                <div className="absolute right-0 top-12 bg-white shadow-lg rounded-xl border border-slate-100 w-44 py-2 z-50">
                  <Link to="/my-profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">My Profile</Link>
                  <Link to="/my-appointments" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">My Appointments</Link>
                  <hr className="my-1 border-slate-100" />
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar