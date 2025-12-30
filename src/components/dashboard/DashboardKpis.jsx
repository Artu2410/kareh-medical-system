import { KpiCard } from '@/components/ui'
import { Users, Calendar, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function DashboardKpis({
  totalPatients,
  totalAppointments,
  appointmentsThisMonth,
  satisfaction,
}) {
  const kpis = [
    {
      title: 'Pacientes Activos',
      value: totalPatients,
      icon: Users,
      trend: '+12% vs mes pasado',
      trendDirection: 'up',
    },
    {
      title: 'Citas Totales',
      value: totalAppointments,
      icon: Calendar,
      trend: '+8 vs mes pasado',
      trendDirection: 'up',
    },
    {
      title: 'Citas Este Mes',
      value: appointmentsThisMonth,
      icon: Zap,
      trend: 'En proceso',
      trendDirection: 'up',
    },
    {
      title: 'Satisfacción',
      value: `${satisfaction}%`,
      icon: TrendingUp,
      trend: '+2.5% improvement',
      trendDirection: 'up',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <KpiCard {...kpi} />
        </motion.div>
      ))}
    </div>
  )
}
