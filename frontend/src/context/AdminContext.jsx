import { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { atoken: aToken }
      })
      return data
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = { backendUrl, aToken, setAToken, getAllDoctors }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export default AdminContextProvider
