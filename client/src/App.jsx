import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) return <Navigate to="/login" replace />
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" replace />

  return children
}

function RoleRedirect() {
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')

  if (!token) return <Navigate to="/login" replace />
  if (role === 'patient') return <Navigate to="/patient" replace />
  if (role === 'doctor') return <Navigate to="/doctor" replace />
  if (role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const themeProps = { theme, setTheme, lang, setLang }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<Login {...themeProps} />} />
        <Route path="/patient/*" element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard {...themeProps} />
          </ProtectedRoute>
        } />
        <Route path="/doctor/*" element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard {...themeProps} />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard {...themeProps} />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}