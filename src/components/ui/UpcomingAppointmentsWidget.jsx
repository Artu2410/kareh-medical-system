import { motion } from 'framer-motion';

export function UpcomingAppointmentsWidget({ appointments = [] }) {
  return (
    <motion.div
      className="glassmorphism p-4 rounded-xl max-h-64 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' }}
    >
      <h3 className="font-bold mb-2">Próximas Citas</h3>
      <ul className="divide-y divide-slate-100">
        {appointments.length === 0 && (
          <li className="py-2 text-slate-400 text-sm">No hay próximas citas</li>
        )}
        {appointments.map(a => (
          <li key={a.id} className="py-2 flex flex-col md:flex-row md:justify-between md:items-center gap-1">
            <span className="font-medium text-slate-700">{a.patient}</span>
            <span className="text-xs text-slate-500">{a.date} {a.time}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
