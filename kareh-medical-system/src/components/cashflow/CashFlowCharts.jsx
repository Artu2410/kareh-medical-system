import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function CashFlowCharts({ flows }) {
  // Agrupar por mes y tipo
  const monthly = {};
  flows.forEach(f => {
    const month = new Date(f.date || f.createdAt).toLocaleString('es-AR', { month: 'short', year: '2-digit' });
    if (!monthly[month]) monthly[month] = { INCOME: 0, EXPENSE: 0 };
    monthly[month][f.type] += Number(f.amount) || 0;
  });
  const monthlyData = Object.entries(monthly).map(([month, vals]) => ({ month, ...vals }));

  // Agrupar por categoría
  const byCategory = {};
  flows.forEach(f => {
    const cat = f.category || 'OTRO';
    if (!byCategory[cat]) byCategory[cat] = 0;
    byCategory[cat] += Number(f.amount) || 0;
  });
  const categoryData = Object.entries(byCategory).map(([cat, value]) => ({ name: cat, value }));
  const COLORS = ['#0D9488', '#f87171', '#fbbf24', '#6366f1', '#10b981', '#f472b6', '#a3e635', '#facc15'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Ingresos/Egresos por Mes</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="INCOME" fill="#10b981" name="Ingresos" />
            <Bar dataKey="EXPENSE" fill="#f87171" name="Egresos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Distribución por Categoría</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {categoryData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
