import { useState, useCallback } from 'react'
import * as appointmentService from '../services/appointments.service'

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Cargar citas de un paciente
   */
  const fetchPatientAppointments = useCallback(async (patientId) => {
    setLoading(true)
    setError(null)
    try {
      const data = await appointmentService.getPatientAppointments(patientId)
      setAppointments(data || [])
    } catch (err) {
      setError(err.message)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Crear nuevo turno
   */
  const createAppointment = useCallback(async (payload) => {
    setLoading(true)
    setError(null)
    try {
      const result = await appointmentService.createAppointment(payload)
      setAppointments(prev => [...prev, ...result.appointments])
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Obtener disponibilidad
   */
  const getAvailability = useCallback(async (professionalId, startDate, endDate) => {
    setLoading(true)
    setError(null)
    try {
      const data = await appointmentService.getAvailability(
        professionalId,
        startDate,
        endDate
      )
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Buscar paciente por DNI
   */
  const searchPatient = useCallback(async (dni) => {
    setLoading(true)
    setError(null)
    try {
      const patient = await appointmentService.searchPatientByDni(dni)
      return patient
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Obtener historia médica
   */
  const getMedicalHistory = useCallback(async (patientId) => {
    setLoading(true)
    setError(null)
    try {
      const history = await appointmentService.getPatientMedicalHistory(patientId)
      return history
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Registrar evolución
   */
  const registerEvolution = useCallback(async (appointmentId, notes) => {
    setLoading(true)
    setError(null)
    try {
      const evolution = await appointmentService.createEvolution(appointmentId, notes)
      return evolution
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Agregar diagnóstico
   */
  const addDiagnosis = useCallback(async (patientId, description) => {
    setLoading(true)
    setError(null)
    try {
      const diagnosis = await appointmentService.addDiagnosis(patientId, description)
      return diagnosis
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    appointments,
    loading,
    error,
    fetchPatientAppointments,
    createAppointment,
    getAvailability,
    searchPatient,
    getMedicalHistory,
    registerEvolution,
    addDiagnosis
  }
}
