import { useState, useCallback, useEffect } from 'react';
import * as patientsService from '../services/patients.service';

/**
 * Hook personalizado para gestión de pacientes
 * Maneja estado, loading, errores y operaciones CRUD
 */
export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar todos los pacientes desde la API
   */
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await patientsService.getPatients();
      setPatients(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
      setPatients([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar pacientes automáticamente al montar el componente
   */
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  /**
   * Agregar nuevo paciente
   */
  const addPatient = useCallback(async (patientData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validar datos antes de enviar
      const validation = patientsService.validatePatientData(patientData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      const newPatient = await patientsService.addPatient(patientData);
      
      // Actualizar estado local
      setPatients(prev => [...prev, newPatient]);
      
      return newPatient;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar paciente existente
   */
  const updatePatient = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validar datos antes de enviar
      const validation = patientsService.validatePatientData(updates);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      const updatedPatient = await patientsService.updatePatient(id, updates);
      
      // Actualizar estado local
      setPatients(prev =>
        prev.map(p => p.id === id ? updatedPatient : p)
      );
      
      return updatedPatient;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar paciente
   */
  const deletePatient = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await patientsService.deletePatient(id);
      
      // Actualizar estado local
      setPatients(prev => prev.filter(p => p.id !== id));
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar paciente por DNI
   */
  const searchByDni = useCallback(async (dni) => {
    setLoading(true);
    setError(null);
    
    try {
      const patient = await patientsService.searchPatientByDni(dni);
      return patient;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Búsqueda local (sin llamar a API)
   */
  const searchLocal = useCallback((query) => {
    if (!query || query.trim() === '') {
      return patients;
    }

    const lowercaseQuery = query.toLowerCase();
    
    return patients.filter(p => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const dni = p.dni?.toString() || '';
      const email = p.email?.toLowerCase() || '';
      const phone = p.phone?.toString() || '';
      
      return (
        fullName.includes(lowercaseQuery) ||
        dni.includes(lowercaseQuery) ||
        email.includes(lowercaseQuery) ||
        phone.includes(query)
      );
    });
  }, [patients]);

  /**
   * Refrescar lista (útil después de operaciones CRUD)
   */
  const refreshPatients = useCallback(() => {
    return fetchPatients();
  }, [fetchPatients]);

  return {
    // Estado
    patients,
    loading,
    error,
    
    // Operaciones CRUD
    fetchPatients,
    addPatient,
    updatePatient,
    deletePatient,
    
    // Búsquedas
    searchByDni,
    searchLocal,
    
    // Utilidades
    refreshPatients,
  };
}