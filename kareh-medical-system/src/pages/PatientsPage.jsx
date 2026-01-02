import { useState } from 'react'
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
  const { loading } = usePatients()
  const [displayPatients, setDisplayPatients] = useState(getPatients())
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Convertir paciente de formato BD (name) a formato formulario (firstName/lastName)
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

  const handleDeletePatient = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      deletePatient(id)
      // Recargar desde servicio para asegurar sincronización
      setDisplayPatients(getPatients())
    }
  }

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowDetails(true)
  }

  const handleFormSubmit = (formData) => {
    if (editingPatient) {
      // Editar paciente existente
      const updatedData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        birthDate: formData.dob,
        email: formData.email || '',
        gender: formData.gender || 'M',
      }
      updatePatient(editingPatient.id, updatedData)
      // Recargar desde servicio para asegurar sincronización
      setDisplayPatients(getPatients())
    } else {
      // Crear nuevo paciente
      const patientData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        birthDate: formData.dob,
        email: formData.email || '',
        gender: formData.gender || 'M',
      }
      addPatient(patientData)
      // Recargar desde servicio para asegurar sincronización
      setDisplayPatients(getPatients())
    }
    setShowForm(false)
    setEditingPatient(null)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pacientes"
        subtitle={`${displayPatients.length} pacientes registrados`}
        action={
          <Button onClick={handleAddPatient}>
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
        <PatientForm
          patient={editingPatient}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingPatient(null)
          }}
        />
      )}

      <PatientsTable
        patients={displayPatients}
        loading={loading}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
        onView={handleViewPatient}
      />

      {/* Patient Details Modal */}
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
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Nombre</p>
              <p className="font-semibold text-slate-900">{selectedPatient.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-semibold text-slate-900">{selectedPatient.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Teléfono</p>
                <p className="font-semibold text-slate-900">{selectedPatient.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Historial Médico</p>
              <p className="font-semibold text-slate-900">{selectedPatient.medicalHistory || 'N/A'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
