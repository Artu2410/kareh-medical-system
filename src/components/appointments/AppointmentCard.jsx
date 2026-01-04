import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { Clock, User, Phone, AlertCircle } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { APPOINTMENT_STATUS_LABELS } from '@/lib/constants'
import { motion } from 'framer-motion'

export function AppointmentCard({
  appointment,
  onEdit,
  onCancel,
  showActions = true,
}) {
  const statusColors = {
    confirmed: 'success',
    pending: 'warning',
    completed: 'default',
    cancelled: 'danger',
  }

  const statusColor = statusColors[appointment.status] || 'default'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card hover className="mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <User className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {appointment.patientName}
                </h3>
                <p className="text-xs text-slate-500">{appointment.reason}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-teal-600" />
                {formatTime(appointment.time)}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                {appointment.duration} min
              </div>
            </div>

            {appointment.notes && (
              <p className="mt-3 text-sm text-slate-500 italic">
                {appointment.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-3 ml-4">
            <Badge variant={statusColor} size="sm">
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </Badge>

            {showActions && appointment.status === 'confirmed' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit?.(appointment)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onCancel?.(appointment.id)}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
