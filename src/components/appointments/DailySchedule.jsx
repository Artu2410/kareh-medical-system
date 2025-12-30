import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { formatDate, formatTime } from '@/lib/utils'
import { Clock, User, Phone, MapPin, ChevronRight } from 'lucide-react'

export function DailySchedule({ appointments, onSelectAppointment, selectedDate }) {
  if (!appointments || appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agenda de {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-500 py-8">
            No hay citas programadas para este día
          </p>
        </CardContent>
      </Card>
    )
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    return a.time.localeCompare(b.time)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda de {formatDate(selectedDate)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedAppointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => onSelectAppointment?.(apt)}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-teal-600">
                    {formatTime(apt.time)}
                  </p>
                  <p className="text-xs text-slate-500">{apt.duration} min</p>
                </div>

                <div className="border-l border-slate-200 pl-4">
                  <p className="font-semibold text-slate-900">{apt.patientName}</p>
                  <p className="text-sm text-slate-500">{apt.reason}</p>
                  {apt.notes && (
                    <p className="text-xs text-slate-400 mt-1 italic">{apt.notes}</p>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
