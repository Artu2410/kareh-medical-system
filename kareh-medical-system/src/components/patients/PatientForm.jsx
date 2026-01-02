import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import { X } from 'lucide-react'

export function PatientForm({
  patient = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = React.useState(
    patient || {
      // Datos básicos
      firstName: '',
      lastName: '',
      dni: '',
      dob: '',
      email: '',
      gender: 'M',
      phone: '',
      address: '',
      // Datos médicos
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
  )

  const [errors, setErrors] = React.useState({})

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

    if (!formData.firstName.trim()) newErrors.firstName = 'Nombre requerido'
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido requerido'
    if (!formData.dni.trim()) newErrors.dni = 'DNI requerido'
    if (!formData.dob) newErrors.dob = 'Fecha de nacimiento requerida'
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido'

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
    <Card className="max-h-[90vh] overflow-y-auto">
      <CardHeader className="sticky top-0 bg-white border-b flex items-center justify-between z-10">
        <CardTitle>{patient ? 'Editar Paciente' : 'Nuevo Paciente'}</CardTitle>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <Input
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                error={errors.dni}
                required
              />
              <Input
                label="Fecha de Nacimiento"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
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
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Género
                </label>
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
              <Input
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Calle, número, ciudad"
              />
            </div>
          </div>

          {/* SECCIÓN 2: CONDICIONES MÉDICAS */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Condiciones Médicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasCancer"
                  checked={formData.hasCancer}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Cáncer</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasPacemaker"
                  checked={formData.hasPacemaker}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Marcapasos</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasBypass"
                  checked={formData.hasBypass}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Bypass Coronario</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasAsthma"
                  checked={formData.hasAsthma}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Asma</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasDiabetes"
                  checked={formData.hasDiabetes}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Diabetes</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasHypertension"
                  checked={formData.hasHypertension}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Hipertensión</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasHeartDisease"
                  checked={formData.hasHeartDisease}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Enfermedad Cardíaca</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasOsteoporosis"
                  checked={formData.hasOsteoporosis}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Osteoporosis</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  name="hasArthritis"
                  checked={formData.hasArthritis}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-sm font-medium">Artritis</span>
              </label>
            </div>
          </div>

          {/* SECCIÓN 3: INFORMACIÓN MÉDICA ADICIONAL */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Información Médica Adicional</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Alergias
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="Alergias medicamentosas, alimentarias, etc."
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Medicamentos Actuales
                </label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  placeholder="Medicamentos que toma actualmente"
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Obra Social
                </label>
                <Input
                  name="socialWorkId"
                  value={formData.socialWorkId}
                  onChange={handleChange}
                  placeholder="ID o nombre de obra social"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Notas Adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Observaciones adicionales sobre el paciente"
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {loading ? 'Guardando...' : patient ? 'Actualizar Paciente' : 'Crear Paciente'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="border border-slate-300"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
