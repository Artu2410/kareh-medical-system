import { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout'
import {
  PatientsTable,
  PatientsToolbar,
  PatientForm,
} from '@/components/patients'
import { usePatients } from '@/hooks'
import { getPatients, addPatient, updatePatient, deletePatient } from '@/services'
import { Modal, Button } from '@/components/ui'

export function PatientsPage() {
  const { loading: hookLoading } = usePatients()
  // 1. SIEMPRE inicializar como array vacío para evitar errores de .map()
  const [displayPatients, setDisplayPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [internalLoading, setInternalLoading] = useState(false)

  // 2. Función asíncrona para cargar pacientes
  const loadPatientsData = async () => {
    setInternalLoading(true)
    try {
      const data = await getPatients()
      setDisplayPatients(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error("Error cargando pacientes: " + (error?.message || error));
      setDisplayPatients([])
    } finally {
      setInternalLoading(false)
    }
  }

  // 3. Cargar datos al montar el componente
  useEffect(() => {
    loadPatientsData()
  }, [])

  const preparePatientForForm = (patient) => {
    if (!patient) return null
    const [firstName = '', lastName = ''] = patient.name ? patient.name.split(' ', 2) : ['', '']
    return {
      ...patient,
      firstName,
      lastName,
      dob: patient.birthDate || patient.dob || '',
      email: patient.email || '',
      gender: patient.gender || 'M',
    }
  }

  const handleSearch = (results) => {
    setDisplayPatients(results)
  }

  const handleFilter = (results) => {
    setDisplayPatients(results)
  }

  const handleAddPatient = () => {
    setEditingPatient(null)
    setShowForm(true)
  }

  const handleEditPatient = (patient) => {
    setEditingPatient(preparePatientForForm(patient))
    setShowForm(true)
  }

  const handleDeletePatient = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      try {
        await deletePatient(id)
        await loadPatientsData() // Recargar datos reales de la BD
      } catch (error) {
        toast.error("Error al eliminar: " + (error?.message || error));
      }
    }
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowDetails(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      const patientData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        birthDate: formData.dob,
        email: formData.email || '',
        gender: formData.gender || 'M',
      }

      if (editingPatient) {
        await updatePatient(editingPatient.id, patientData)
      } else {
        await addPatient(patientData)
      }
      
      await loadPatientsData() // Refrescar lista
      setShowForm(false)
      setEditingPatient(null)
    } catch (error) {
      toast.error("Error al guardar: " + (error?.message || error));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pacientes"
        subtitle={`${displayPatients.length} pacientes registrados`}
        action={
          <Button onClick={handleAddPatient} className="bg-teal-600 text-white">
            + Nuevo Paciente
          </Button>
        }
      />

      <PatientsToolbar
        patients={displayPatients}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onAddPatient={handleAddPatient}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <PatientForm
              patient={editingPatient}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingPatient(null)
              }}
            />
           </div>
        </div>
      )}

      <PatientsTable
        patients={displayPatients}
        loading={hookLoading || internalLoading}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onView={handleViewPatient}
      />

      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false)
          setSelectedPatient(null)
        }}
        title="Detalles del Paciente"
      >
        {selectedPatient && (
          <div className="space-y-4 p-4">
            <div>
              <p className="text-sm text-slate-500">Nombre Completo</p>
              <p className="font-semibold text-slate-900">{selectedPatient.name || `${selectedPatient.firstName} ${selectedPatient.lastName}`}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">DNI</p>
                <p className="font-semibold text-slate-900">{selectedPatient.dni}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Teléfono</p>
                <p className="font-semibold text-slate-900">{selectedPatient.phone}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}