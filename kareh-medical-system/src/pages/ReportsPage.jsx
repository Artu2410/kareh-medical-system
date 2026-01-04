import React, { useEffect, useState } from 'react';
import { getStats } from '@/services';
// Si usas Recharts:
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Cargando reportes...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reportes y KPIs</h1>
      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-teal-700">{stats?.appointmentsToday ?? '-'}</div>
          <div className="text-slate-500">Turnos de hoy</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-teal-700">{stats?.activePatients ?? '-'}</div>
          <div className="text-slate-500">Pacientes activos</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-teal-700">{stats?.pendingOrders ?? '-'}</div>
          <div className="text-slate-500">Órdenes pendientes</div>
        </div>
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="text-3xl font-bold text-teal-700">{stats?.activeTreatments ?? '-'}</div>
          <div className="text-slate-500">Tratamientos activos</div>
        </div>
      </div>
      {/* Aquí puedes agregar gráficos con Recharts, tablas, filtros, etc. */}
      <div className="bg-white rounded shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Gráficos y análisis</h2>
        <div className="text-slate-400">(Próximamente: gráficos de asistencia, cancelaciones, ingresos, etc.)</div>
      </div>
    </div>
  );
}
