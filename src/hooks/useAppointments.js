import { useState, useCallback } from 'react'
import { getAppointments } from '../services/appointments.service'

export function useAppointments() {
  const [appointments, setAppointments] = useState(getAppointments())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAppointments = useCallback(() => {
    setLoading(true)
    try {
      const data = getAppointments()
      setAppointments(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addAppointment = useCallback((appointment) => {
    setAppointments(prev => [...prev, { ...appointment, id: Date.now() }])
  }, [])

  const updateAppointment = useCallback((id, updates) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
    )
  }, [])

  const deleteAppointment = useCallback((id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id))
  }, [])

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  }
}
