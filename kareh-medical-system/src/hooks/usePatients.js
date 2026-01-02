import { useState, useCallback } from 'react'
import { getPatients } from '../services/patients.service'

export function usePatients() {
  const [patients, setPatients] = useState(getPatients())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPatients = useCallback(() => {
    setLoading(true)
    try {
      const data = getPatients()
      setPatients(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addPatient = useCallback((patient) => {
    setPatients(prev => [...prev, { ...patient, id: Date.now() }])
  }, [])

  const updatePatient = useCallback((id, updates) => {
    setPatients(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    )
  }, [])

  const deletePatient = useCallback((id) => {
    setPatients(prev => prev.filter(p => p.id !== id))
  }, [])

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
  }
}
