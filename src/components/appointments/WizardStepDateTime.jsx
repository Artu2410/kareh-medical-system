import { Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui'
import { TimeSlotsGrid } from './TimeSlotsGrid'
import { getAppointmentSlots } from '@/services/appointments.service'
import { useState, useMemo } from 'react'

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

  const slots = useMemo(() => {
    if (!selectedDate || !doctorId) return []
    return getAppointmentSlots(doctorId, selectedDate)
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

        {selectedDate && slots.length > 0 && (
          <div>
            <label className="text-sm font-medium text-slate-700 mb-4 block">
              Horarios Disponibles
            </label>
            <TimeSlotsGrid
              slots={slots}
              selectedTime={selectedTime}
              onSelectTime={onTimeChange}
              maxAppointmentsPerSlot={5}
            />
          </div>
        )}

        {selectedDate && slots.length === 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-sm text-amber-800">
              No hay horarios disponibles para esta fecha. Por favor, selecciona otro día.
            </p>
          </div>
        )}

        {selectedDate && selectedTime && (
          <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <p className="font-semibold text-slate-900">Resumen</p>
            <p className="text-sm text-slate-600 mt-2">
              📅 {new Date(selectedDate).toLocaleDateString('es-ES')}
            </p>
            <p className="text-sm text-slate-600">
              🕐 {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
