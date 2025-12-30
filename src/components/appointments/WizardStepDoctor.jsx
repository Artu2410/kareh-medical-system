import { Card, CardContent, CardHeader, CardTitle, Select } from '@/components/ui'

const DOCTORS = [
  { id: 1, name: 'Dr. Juan Pérez', specialty: 'Medicina General' },
  { id: 2, name: 'Dra. Laura Rodríguez', specialty: 'Cardiología' },
  { id: 3, name: 'Dr. Carlos López', specialty: 'Dermatología' },
  { id: 4, name: 'Dra. María González', specialty: 'Pediatría' },
]

export function WizardStepDoctor({
  selectedDoctor,
  onSelectDoctor,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 2: Seleccionar Profesional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          label="Seleccionar Médico"
          options={DOCTORS.map(doctor => ({
            value: doctor.id,
            label: `${doctor.name} - ${doctor.specialty}`,
          }))}
          value={selectedDoctor?.id || ''}
          onChange={(value) => {
            const doctor = DOCTORS.find(d => d.id === parseInt(value))
            onSelectDoctor(doctor)
          }}
          required
        />

        {selectedDoctor && (
          <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <p className="font-semibold text-slate-900">{selectedDoctor.name}</p>
            <p className="text-sm text-slate-600 mt-1">{selectedDoctor.specialty}</p>
            <p className="text-xs text-slate-500 mt-2">
              Disponible de lunes a viernes, 8:00 a 17:00
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
