import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select'; // Asumiendo que existe un componente Select
import { Eye, PlusCircle } from 'lucide-react';

// Mock data basado en la entidad TreatmentPlan
const mockTreatmentPlans = [
  {
    id: 'tp_001',
    patient_id: 'p_001',
    patient_name: 'Ana García',
    professional_id: 'prof_01',
    diagnosis: 'Lumbalgia mecánica',
    treatment_type: 'kinesiologia',
    total_sessions: 10,
    completed_sessions: 5,
    status: 'active',
  },
  {
    id: 'tp_002',
    patient_id: 'p_002',
    patient_name: 'Carlos Sánchez',
    professional_id: 'prof_02',
    diagnosis: 'Esguince de tobillo',
    treatment_type: 'rehabilitacion',
    total_sessions: 8,
    completed_sessions: 8,
    status: 'completed',
  },
  {
    id: 'tp_003',
    patient_id: 'p_003',
    patient_name: 'Laura Fernandez',
    professional_id: 'prof_01',
    diagnosis: 'ACV - Hemiparesia derecha',
    treatment_type: 'neurologia',
    total_sessions: 20,
    completed_sessions: 2,
    status: 'pending_scheduling',
  },
  {
    id: 'tp_004',
    patient_id: 'p_004',
    patient_name: 'Roberto Diaz',
    professional_id: 'prof_03',
    diagnosis: 'Tendinitis del manguito rotador',
    treatment_type: 'traumatologia',
    total_sessions: 12,
    completed_sessions: 9,
    status: 'on_hold',
  },
    {
    id: 'tp_005',
    patient_id: 'p_005',
    patient_name: 'Julieta Martinez',
    professional_id: 'prof_02',
    diagnosis: 'Post-operatorio de LCA',
    treatment_type: 'deportiva',
    total_sessions: 15,
    completed_sessions: 11,
    status: 'active',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  pending_scheduling: 'bg-purple-100 text-purple-800',
};

const treatmentTypeTranslations = {
    kinesiologia: "Kinesiología",
    rehabilitacion: "Rehabilitación",
    traumatologia: "Traumatología",
    neurologia: "Neurología",
    respiratoria: "Respiratoria",
    deportiva: "Deportiva",
    otro: "Otro"
}

// Un simple componente de barra de progreso si no existe en la UI
const Progress = ({ value, max }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-teal-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};


const TreatmentPlanCard = ({ plan }) => {
  const remainingSessions = plan.total_sessions - plan.completed_sessions;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{plan.patient_name}</CardTitle>
                <p className="text-sm text-slate-500">{plan.diagnosis}</p>
            </div>
            <Badge className={statusColors[plan.status]}>{plan.status.replace('_', ' ')}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-slate-600">Progreso de Sesiones</span>
                <span className="text-slate-500">{plan.completed_sessions} / {plan.total_sessions}</span>
            </div>
            <Progress value={plan.completed_sessions} max={plan.total_sessions} />
            <p className="text-xs text-right mt-1 text-slate-400">{remainingSessions} restantes</p>
        </div>
        <div className="flex justify-between items-center text-sm border-t pt-4">
            <p className="text-slate-600">
                <span className="font-medium">Tratamiento: </span>
                <span>{treatmentTypeTranslations[plan.treatment_type]}</span>
            </p>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="w-4 h-4" /> Ver Paciente
                </Button>
                 <Button variant="default" size="sm" className="gap-2 bg-teal-500 hover:bg-teal-600">
                    <PlusCircle className="w-4 h-4" /> Agendar Sesión
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TreatmentPlans = () => {
  const [plans, setPlans] = useState(mockTreatmentPlans);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const statusMatch = statusFilter === 'all' || plan.status === statusFilter;
      const typeMatch = typeFilter === 'all' || plan.treatment_type === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [plans, statusFilter, typeFilter]);
  
  // Asumiendo que `Select` es un componente que acepta `value`, `onChange`, y un array de `options`
  // <Select value={filter} onChange={setFilter} options={[{value: 'all', label: 'Todos'}]} />
  
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Filtros de Planes de Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
                {/* Estos deberían ser reemplazados por el componente Select de la UI */}
                <div className="flex-1">
                    <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                    <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500">
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="completed">Completados</option>
                        <option value="on_hold">En espera</option>
                        <option value="pending_scheduling">Pendiente agendar</option>
                        <option value="cancelled">Cancelados</option>
                    </select>
                </div>
                 <div className="flex-1">
                    <label htmlFor="type-filter" className="block text-sm font-medium text-slate-700 mb-1">Tipo de Tratamiento</label>
                    <select id="type-filter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500">
                        <option value="all">Todos los tipos</option>
                        {Object.entries(treatmentTypeTranslations).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredPlans.length > 0 ? (
                filteredPlans.map(plan => <TreatmentPlanCard key={plan.id} plan={plan} />)
            ) : (
                <p className="text-slate-500 lg:col-span-3 text-center">No se encontraron planes de tratamiento con los filtros seleccionados.</p>
            )}
        </div>
    </div>
  );
};

export default TreatmentPlans;