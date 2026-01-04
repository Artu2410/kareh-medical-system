import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { ArrowRight, Clock, Users, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function QuickActionsWidget({ onNewAppointment, onNewPatient }) {
  const actions = [
    {
      id: 'new-appointment',
      title: 'Nueva Cita',
      description: 'Programar una nueva cita',
      icon: Clock,
      action: onNewAppointment,
    },
    {
      id: 'new-patient',
      title: 'Nuevo Paciente',
      description: 'Registrar un paciente',
      icon: Users,
      action: onNewPatient,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-slate-900 to-teal-700 bg-clip-text text-transparent">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                onClick={action.action}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-teal-50/50 to-emerald-50/50 border border-teal-200/30 hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-3 shadow-md">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{action.title}</p>
                    <p className="text-sm text-slate-500">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-teal-500" />
              </motion.button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentActivitiesWidget({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-slate-900 to-teal-700 bg-clip-text text-transparent">Actividades Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-500 py-8">Sin actividades recientes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-slate-900 to-teal-700 bg-clip-text text-transparent">Actividades Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              className="flex items-start gap-3 pb-3 px-3 py-2 rounded-lg hover:bg-teal-50/30 border-b border-slate-100 last:border-b-0 last:pb-0 transition-colors"
            >
              <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full p-2 mt-1 flex-shrink-0 shadow-sm">
                <AlertCircle className="w-4 h-4 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">{activity.title}</p>
                <p className="text-xs text-slate-600">{activity.description}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
