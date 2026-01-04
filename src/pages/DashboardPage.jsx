import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout';
import {
  DashboardKpis,
  AppointmentTrendChart,
  PatientDemographicsChart,
  AppointmentStatusChart,
  QuickActionsWidget,
  RecentActivitiesWidget,
} from '@/components/dashboard';
import { getStats, getAppointmentStats, getPatientDemographics, getAppointmentStatusStats } from '@/services';
import { CardSkeleton } from '@/components/ui';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState([]);
  const [patientDemographics, setPatientDemographics] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular carga con delay para mostrar animaciones
    setTimeout(() => {
      const statsData = getStats();
      const appointmentStatsData = getAppointmentStats();
      const patientDemographicsData = getPatientDemographics();
      const appointmentStatusData = getAppointmentStatusStats();

      setStats(statsData);
      setAppointmentStats(appointmentStatsData);
      setPatientDemographics(patientDemographicsData);
      setAppointmentStatus(appointmentStatusData);
      setLoading(false);
    }, 800);
  }, []);

  const handleNewAppointment = () => {
    navigate('/appointments');
  };

  const handleNewPatient = () => {
    navigate('/patients');
  };

  const recentActivities = [
    { id: 1, title: 'Nueva cita confirmada', description: 'Carlos Méndez', time: 'hace 2 horas' },
    { id: 2, title: 'Paciente registrado', description: 'Ana López', time: 'hace 4 horas' },
    { id: 3, title: 'Cita completada', description: 'María García', time: 'hace 1 día' },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" subtitle="Cargando datos..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* HEADER con gradiente animado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PageHeader
          title={
            <span className="gradient-text text-4xl font-bold">
              Dashboard
            </span>
          }
          subtitle="Bienvenido a tu panel de control médico"
        />
      </motion.div>

      {/* KPIs con delay escalonado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardKpis
          totalPatients={stats.totalPatients}
          totalAppointments={stats.totalAppointments}
          appointmentsThisMonth={stats.appointmentsThisMonth}
          satisfaction={stats.patientsSatisfaction}
        />
      </div>

      {/* Layout de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráficos principales */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lg:col-span-2 space-y-6"
        >
          <AppointmentTrendChart data={appointmentStats} />
          <PatientDemographicsChart data={patientDemographics} />
        </motion.div>

        {/* Widgets laterales */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          <QuickActionsWidget
            onNewAppointment={handleNewAppointment}
            onNewPatient={handleNewPatient}
          />
          <RecentActivitiesWidget activities={recentActivities} />
        </motion.div>
      </div>

      {/* Gráfico de estado de citas */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <AppointmentStatusChart data={appointmentStatus} />
      </motion.div>

      {/* Floating Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-teal-500/5 to-purple-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-pink-500/5 to-blue-500/5 rounded-full blur-3xl"
        />
      </div>
    </motion.div>
  );
}