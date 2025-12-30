import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input, Select, Button } from '@/components/ui'
import { X } from 'lucide-react'
import { GENDERS, BLOOD_TYPES } from '@/lib/constants'

export function PatientForm({
  patient = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = React.useState(
    patient || {
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: 'M',
      bloodType: 'O+',
      medicalHistory: '',
    }
  )

  const [errors, setErrors] = React.useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido'
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es requerida'

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
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{patient ? 'Editar Paciente' : 'Nuevo Paciente'}</CardTitle>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            <Input
              label="Fecha de Nacimiento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              error={errors.birthDate}
              required
            />
            <Select
              label="Género"
              options={GENDERS}
              value={formData.gender}
              onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            />
            <Select
              label="Tipo de Sangre"
              options={BLOOD_TYPES.map(type => ({ value: type, label: type }))}
              value={formData.bloodType}
              onChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Historial Médico
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Alergias, condiciones crónicas, etc."
              rows="4"
              className="w-full px-4 py-2 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : patient ? 'Actualizar' : 'Crear Paciente'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
