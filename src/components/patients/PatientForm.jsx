import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import { X } from 'lucide-react'

const initialFormState = {
  firstName: '',
  lastName: '',
  dni: '',
  dob: '',
  email: '',
  gender: 'M',
  phone: '',
  address: '',
  hasCancer: false,
  hasPacemaker: false,
  hasBypass: false,
  hasAsthma: false,
  hasDiabetes: false,
  hasHypertension: false,
  hasHeartDisease: false,
  hasOsteoporosis: false,
  hasArthritis: false,
  allergies: '',
  currentMedications: '',
  socialWorkId: '',
  notes: ''
}

export function PatientForm({
  patient = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})

  // ESTO ARREGLA EL BOTÓN NUEVO: 
  // Sincroniza el estado interno cuando cambia la prop 'patient'
  useEffect(() => {
    if (patient) {
      setFormData({ ...initialFormState, ...patient })
    } else {
      setFormData(initialFormState)
    }
    setErrors({})
  }, [patient])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName?.trim()) newErrors.firstName = 'Nombre requerido'
    if (!formData.lastName?.trim()) newErrors.lastName = 'Apellido requerido'
    if (!formData.dni?.trim()) newErrors.dni = 'DNI requerido'
    if (!formData.dob) newErrors.dob = 'Fecha de nacimiento requerida'
    if (!formData.phone?.trim()) newErrors.phone = 'Teléfono requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <Card className="border-none shadow-none flex flex-col h-full max-h-[90vh]">
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
        <CardTitle className="text-xl font-bold text-slate-800">
          {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
        </CardTitle>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-6">
        <form id="patient-form" onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <section>
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
              <Input label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
              <Input label="DNI" name="dni" value={formData.dni} onChange={handleChange} error={errors.dni} required />
              <Input label="Fecha de Nacimiento" name="dob" type="date" value={formData.dob} onChange={handleChange} error={errors.dob} required />
              <Input label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Género</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <Input label="Dirección" name="address" value={formData.address} onChange={handleChange} placeholder="Calle, número, ciudad" />
            </div>
          </section>

          {/* SECCIÓN 2: CONDICIONES MÉDICAS */}
          <section>
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">Antecedentes Médicos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {id: 'hasCancer', label: 'Cáncer'},
                {id: 'hasPacemaker', label: 'Marcapasos'},
                {id: 'hasBypass', label: 'Bypass'},
                {id: 'hasAsthma', label: 'Asma'},
                {id: 'hasDiabetes', label: 'Diabetes'},
                {id: 'hasHypertension', label: 'Hipertensión'},
                {id: 'hasHeartDisease', label: 'Cardiopatía'},
                {id: 'hasOsteoporosis', label: 'Osteoporosis'},
                {id: 'hasArthritis', label: 'Artritis'},
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-2 p-2 rounded-md border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name={item.id}
                    checked={formData[item.id]}
                    onChange={handleChange}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <span className="text-xs font-medium text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* SECCIÓN 3: INFORMACIÓN MÉDICA ADICIONAL */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider">Observaciones Clínicas</h3>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Alergias</label>
              <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows="2" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Medicamentos Actuales</label>
              <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} rows="2" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <Input label="Obra Social / Prepaga" name="socialWorkId" value={formData.socialWorkId} onChange={handleChange} />
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Notas del Profesional</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
          </section>
        </form>
      </CardContent>

      <div className="border-t p-6 bg-slate-50 flex gap-3">
        <Button
          type="submit"
          form="patient-form"
          disabled={loading}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-6"
        >
          {loading ? 'Guardando...' : patient ? 'Guardar Cambios' : 'Registrar Paciente'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="px-8 border border-slate-200"
        >
          Cancelar
        </Button>
      </div>
    </Card>
  )
}