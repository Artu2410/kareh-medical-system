import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout'
import {
  PatientsTable,
  PatientsToolbar,
  PatientForm,
} from '@/components/patients'
import { usePatients } from '@/hooks'
import { Modal, Button } from '@/components/ui'

export function PatientsPage() {
  const { patients, loading, error, addPatient, updatePatient, deletePatient, refreshPatients } = usePatients()
  const [displayPatients, setDisplayPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Sincronizar displayPatients cuando los pacientes del hook cambien
  useEffect(() => {
    if (patients) {
      setDisplayPatients(patients)
    }
  }, [patients])

  const handleSearch = (results) => setDisplayPatients(results)
  const handleFilter = (results) => setDisplayPatients(results)

  const handleAddPatient = () => {
    setEditingPatient(null)
    setShowForm(true)
  }

  const handleEditPatient = (patient) => {
    setEditingPatient(patient)
    setShowForm(true)
  }

  const handleDeletePatient = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      await deletePatient(id)
    }
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowDetails(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData)
      } else {
        await addPatient(formData)
      }
      setShowForm(false)
      setEditingPatient(null)
      refreshPatients() // Recargar lista tras guardar
    } catch (err) {
      console.error("Error al guardar:", err)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar pacientes: {error}
        <Button onClick={refreshPatients} className="ml-4">Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pacientes"
        subtitle={`${displayPatients.length} pacientes registrados`}
        action={
          <Button onClick={handleAddPatient} className="bg-teal-600 hover:bg-teal-700 text-white">
            + Nuevo Paciente
          </Button>
        }
      />

      <PatientsToolbar
        patients={patients}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {/* MODAL DEL FORMULARIO */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[95vh] overflow-hidden">
            <PatientForm
              patient={editingPatient}
              onSubmit={handleFormSubmit}
              loading={loading}
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
        loading={loading}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onView={handleViewPatient}
      />

      {/* MODAL DE DETALLES */}
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false)
          setSelectedPatient(null)
        }}
        title="Detalles del Paciente"
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nombre Completo</p>
                <p className="font-semibold text-slate-900 text-lg">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">DNI</p>
                <p className="font-semibold text-slate-900 text-lg">{selectedPatient.dni}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-slate-700">{selectedPatient.email || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Teléfono</p>
                <p className="text-slate-700">{selectedPatient.phone || 'No registrado'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}