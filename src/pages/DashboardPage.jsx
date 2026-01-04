import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import {
  DashboardKpis,
  AppointmentTrendChart,
  PatientDemographicsChart,
  AppointmentStatusChart,
  QuickActionsWidget,
  RecentActivitiesWidget,
} from '@/components/dashboard'
import { getStats, getAppointmentStats, getPatientDemographics, getAppointmentStatusStats } from '@/services'

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [appointmentStats, setAppointmentStats] = useState([])
  const [patientDemographics, setPatientDemographics] = useState([])
  const [appointmentStatus, setAppointmentStatus] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const statsData = getStats()
    const appointmentStatsData = getAppointmentStats()
    const patientDemographicsData = getPatientDemographics()
    const appointmentStatusData = getAppointmentStatusStats()
    
    setStats(statsData)
    setAppointmentStats(appointmentStatsData)
    setPatientDemographics(patientDemographicsData)
    setAppointmentStatus(appointmentStatusData)
  }, [])

  const handleNewAppointment = () => {
    // Futuro: podría abrir un modal (AppointmentWizard)
    navigate('/appointments');
  };

  const handleNewPatient = () => {
    // Futuro: podría abrir un modal (PatientForm)
    navigate('/patients');
  };

  if (!stats) {
    return <div className="text-center py-8">Cargando...</div>
  }

  const recentActivities = [
    { id: 1, title: 'Nueva cita confirmada', description: 'Carlos Méndez', time: 'hace 2 horas' },
    { id: 2, title: 'Paciente registrado', description: 'Ana López', time: 'hace 4 horas' },
    { id: 3, title: 'Cita completada', description: 'María García', time: 'hace 1 día' },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Bienvenido a tu panel de control médico"
        titleClassName="bg-gradient-to-r from-slate-900 via-teal-600 to-emerald-600 bg-clip-text text-transparent"
      />

      <DashboardKpis
        totalPatients={stats.totalPatients}
        totalAppointments={stats.totalAppointments}
        appointmentsThisMonth={stats.appointmentsThisMonth}
        satisfaction={stats.patientsSatisfaction}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentTrendChart data={appointmentStats} />
          <PatientDemographicsChart data={patientDemographics} />
        </div>
        <div className="space-y-6">
          <QuickActionsWidget
            onNewAppointment={handleNewAppointment}
            onNewPatient={handleNewPatient}
          />
          <RecentActivitiesWidget activities={recentActivities} />
        </div>
      </div>

      <AppointmentStatusChart data={appointmentStatus} />
    </div>
  )
}
