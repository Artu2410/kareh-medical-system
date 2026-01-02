import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import { useState, useEffect } from 'react'

export function WizardStepDateTime({
  selectedDate,
  selectedTime,
  doctorId,
  onDateChange,
  onTimeChange,
}) {
  const [minDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })

  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Generar slots disponibles (cada 30 minutos de 9:00 a 17:00)
  useEffect(() => {
    const generateSlots = () => {
      const times = []
      for (let hour = 9; hour < 17; hour++) {
        for (let minutes of [0, 30]) {
          const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
          times.push(time)
        }
      }
      setSlots(times)
    }
    generateSlots()
  }, [selectedDate, doctorId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 3: Seleccionar Fecha y Hora</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Fecha de la Cita
          </label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={minDate}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Horario Disponible
          </label>
          {loadingSlots ? (
            <p className="text-center text-slate-500">Cargando horarios...</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((time) => (
                <button
                  key={time}
                  onClick={() => onTimeChange(time)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    selectedTime === time
                      ? 'border-teal-600 bg-teal-50 text-teal-700'
                      : 'border-slate-200 hover:border-teal-300 text-slate-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedDate && selectedTime && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="font-semibold text-green-900">✓ Fecha y hora seleccionadas</p>
            <p className="text-sm text-green-700 mt-2">
              {new Date(selectedDate).toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} a las {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
