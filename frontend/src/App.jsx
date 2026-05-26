import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import DoctorList from './pages/DoctorList'
import DoctorProfile from './pages/DoctorProfile'
import BookAppointment from './pages/BookAppointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import About from './pages/About'
import Contact from './pages/Contact'

import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfilePage from './pages/doctor/DoctorProfile'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'
import AllAppointments from './pages/admin/AllAppointments'

const App = () => {
  const { pathname } = useLocation()
  const isPortal = pathname.startsWith('/admin') || pathname.startsWith('/doctor/')

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      {!isPortal && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Patient routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctors/:speciality" element={<DoctorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Doctor portal */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/profile" element={<DoctorProfilePage />} />

          {/* Admin portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-doctor" element={<AddDoctor />} />
          <Route path="/admin/doctors" element={<DoctorsList />} />
          <Route path="/admin/appointments" element={<AllAppointments />} />
        </Routes>
      </main>
      {!isPortal && <Footer />}
    </div>
  )
}

export default App
