import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export function DailySchedule({ appointments = [], selectedDate }) {
  // Filtrar citas que correspondan a la fecha seleccionada
  const filteredAppointments = (appointments || []).filter(apt => {
    const dateVal = apt.date || apt.slot
    if (!dateVal) return false
    const aptDate = new Date(dateVal).toISOString().split('T')[0]
    return aptDate === selectedDate
  })

  if (filteredAppointments.length === 0) {
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

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const timeA = new Date(a.date || a.slot).getTime()
    const timeB = new Date(b.date || b.slot).getTime()
    return timeA - timeB
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
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-center min-w-20">
                  <p className="text-lg font-bold text-teal-600">
                    {new Date(apt.date || apt.slot).toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-slate-500">30 min</p>
                </div>

                <div className="border-l border-slate-200 pl-4 flex-1">
                  <p className="font-semibold text-slate-900">
                    {apt.patient?.firstName} {apt.patient?.lastName || 'Paciente'}
                  </p>
                  <p className="text-sm text-slate-500">{apt.therapyType || 'FKT'}</p>
                  {apt.diagnosis && (
                    <p className="text-xs text-slate-400 mt-1">{apt.diagnosis}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                  apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  apt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {apt.status || 'SCHEDULED'}
                </span>
                {apt.isFirstSession && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Primera sesión
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
