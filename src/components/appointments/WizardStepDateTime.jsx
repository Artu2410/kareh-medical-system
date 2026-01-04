import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui'
import { TimeSlotsGrid } from './TimeSlotsGrid'
import { getAppointmentsByDate } from '@/services'
import { MAX_APPOINTMENTS_PER_SLOT, APPOINTMENT_DURATION, TIME_SLOTS } from '@/lib/constants'
import { format } from 'date-fns'

// Utility function to generate slots with availability counts
const generateTimeSlots = (appointments, selectedDate, maxAppointmentsPerSlot, timeSlots) => {
  const currentDayAppointments = appointments.filter(apt => 
    apt.date === selectedDate && !['cancelled', 'rescheduled'].includes(apt.status)
  )

  return timeSlots.map(time => {
    const count = currentDayAppointments.filter(apt => apt.start_time === time).length
    return { time, count }
  })
}

export function WizardStepDateTime({
  selectedDate,
  selectedTime,
  doctorId, // Not used for slot generation yet, but kept for future use
  onDateChange,
  onTimeChange,
}) {
  const [minDate] = useState(() => {
    const today = new Date()
    today.setDate(today.getDate()) // Can book for today
    return today.toISOString().split('T')[0]
  })

  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [appointmentsForDate, setAppointmentsForDate] = useState([])

  useEffect(() => {
    const fetchAppointmentsAndGenerateSlots = async () => {
      if (!selectedDate) {
        setAvailableSlots([])
        return
      }

      setLoadingSlots(true)
      try {
        const fetchedAppointments = await getAppointmentsByDate(selectedDate)
        setAppointmentsForDate(fetchedAppointments || [])
        
        const generatedSlots = generateTimeSlots(
          fetchedAppointments || [],
          selectedDate,
          MAX_APPOINTMENTS_PER_SLOT,
          TIME_SLOTS
        )
        setAvailableSlots(generatedSlots)
      } catch (error) {
        console.error('Error fetching appointments or generating slots:', error)
        setAvailableSlots(
          TIME_SLOTS.map(time => ({ time, count: 0 })) // Fallback to empty slots
        )
      } finally {
        setLoadingSlots(false)
      }
    }

    fetchAppointmentsAndGenerateSlots()
  }, [selectedDate])

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
            <TimeSlotsGrid
              slots={availableSlots}
              selectedTime={selectedTime}
              onSelectTime={onTimeChange}
              maxAppointmentsPerSlot={MAX_APPOINTMENTS_PER_SLOT}
            />
          )}
        </div>

        {selectedDate && selectedTime && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="font-semibold text-green-900">✓ Fecha y hora seleccionadas</p>
            <p className="text-sm text-green-700 mt-2">
              {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString('es-AR', {
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
