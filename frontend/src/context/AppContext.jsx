import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userData, setUserData] = useState(null)
  const [doctors, setDoctors] = useState([])

  const getDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`)
      if (data.success) setDoctors(data.doctors)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const loadUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token }
      })
      if (data.success) setUserData(data.userData)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => { getDoctors() }, [])
  useEffect(() => { if (token) loadUserData() }, [token])

  const value = {
    backendUrl, token, setToken,
    userData, setUserData, loadUserData,
    doctors, getDoctors
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider
