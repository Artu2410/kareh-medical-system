
import React, { useEffect, useState } from 'react';
import { getPatientById } from '@/services/patients.service';
import { getPatientEvolutions, createEvolution, updateEvolution, deleteEvolution } from '@/services/evolutions.service';
import EvolutionForm from '@/components/evolutions/EvolutionForm';
import MedicalOrders from '@/components/MedicalOrders';
import TreatmentPlans from '@/components/TreatmentPlans';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function PatientDetailPage({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [evolutions, setEvolutions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('info');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const p = await getPatientById(patientId);
        setPatient(p);
        const evs = await getPatientEvolutions(patientId);
        setEvolutions(Array.isArray(evs) ? evs : []);
      } catch (err) {
        toast.error('Error cargando datos del paciente');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [patientId]);

  const handleEdit = (evolution) => {
    setEditingEvolution(evolution);
    setShowForm(true);
  };

  const handleDelete = async (evolutionId) => {
    if (!window.confirm('¿Seguro que deseas borrar esta evolución?')) return;
    try {
      await deleteEvolution(evolutionId);
      toast.success('Evolución eliminada');
      const evs = await getPatientEvolutions(patientId);
      setEvolutions(Array.isArray(evs) ? evs : []);
    } catch (err) {
      toast.error('Error al borrar la evolución');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingEvolution) {
        await updateEvolution(editingEvolution.id, values);
        toast.success('Evolución actualizada');
      } else {
        await createEvolution({ ...values, patientId });
        toast.success('Evolución registrada');
      }
      setShowForm(false);
      setEditingEvolution(null);
      // Recargar evoluciones
      const evs = await getPatientEvolutions(patientId);
      setEvolutions(Array.isArray(evs) ? evs : []);
    } catch (err) {
      toast.error('Error al guardar la evolución');
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!patient) return <div className="p-6">Paciente no encontrado</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{patient.full_name}</h1>
      <div className="mb-2 text-slate-600">DNI: {patient.dni} | Tel: {patient.phone}</div>
      {/* KPIs rápidos */}
      <div className="flex gap-4 mb-6">
        <KpiCard title="Edad" value={patient.age || '-'} />
        <KpiCard title="Género" value={patient.gender || '-'} />
        <KpiCard title="Obra Social" value={patient.social_work_name || '-'} />
      </div>
      {/* Tabs navegación */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        <Button variant={tab === 'info' ? 'primary' : 'outline'} onClick={() => setTab('info')}>Info Personal</Button>
        <Button variant={tab === 'history' ? 'primary' : 'outline'} onClick={() => setTab('history')}>Historia Clínica</Button>
        <Button variant={tab === 'appointments' ? 'primary' : 'outline'} onClick={() => setTab('appointments')}>Turnos</Button>
        <Button variant={tab === 'orders' ? 'primary' : 'outline'} onClick={() => setTab('orders')}>Órdenes</Button>
        <Button variant={tab === 'treatments' ? 'primary' : 'outline'} onClick={() => setTab('treatments')}>Tratamientos</Button>
        <Button variant={tab === 'evolutions' ? 'primary' : 'outline'} onClick={() => setTab('evolutions')}>Evoluciones</Button>
      </div>
      {/* Contenido de cada tab */}
      {tab === 'info' && (
        <Card className="mb-8">
          <div className="p-4">
            <div><b>Nombre:</b> {patient.full_name}</div>
            <div><b>DNI:</b> {patient.dni}</div>
            <div><b>Teléfono:</b> {patient.phone}</div>
            <div><b>Email:</b> {patient.email}</div>
            <div><b>Dirección:</b> {patient.address}</div>
            <div><b>Fecha de nacimiento:</b> {patient.dob}</div>
            <div><b>Género:</b> {patient.gender}</div>
            <div><b>Obra Social:</b> {patient.social_work_name}</div>
          </div>
        </Card>
      )}
      {tab === 'history' && (
        <Card className="mb-8">
          <div className="p-4">
            <div><b>Antecedentes:</b> {patient.medical_history || 'No registrado'}</div>
            <div><b>Patologías crónicas:</b> {patient.chronic_conditions || 'No registrado'}</div>
            <div><b>Medicaciones:</b> {patient.medications || 'No registrado'}</div>
            <div><b>Alergias:</b> {patient.allergies || 'No registrado'}</div>
          </div>
        </Card>
      )}
      {tab === 'appointments' && (
        <Card className="mb-8">
          <div className="p-4">(Aquí se mostrarán los turnos del paciente)</div>
        </Card>
      )}
      {tab === 'orders' && (
        <MedicalOrders />
      )}
      {tab === 'treatments' && (
        <TreatmentPlans />
      )}
      {tab === 'evolutions' && (
        <div className="mb-8">
          <div className="mb-6">
            <Button onClick={() => { setShowForm(true); setEditingEvolution(null); }}>Nueva Evolución</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2">Fecha</th>
                  <th className="p-2">S</th>
                  <th className="p-2">O</th>
                  <th className="p-2">A</th>
                  <th className="p-2">P</th>
                  <th className="p-2">Dolor</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {evolutions.length === 0 && (
                  <tr><td colSpan={7} className="text-center p-4 text-slate-400">Sin evoluciones registradas</td></tr>
                )}
                {evolutions.map(ev => (
                  <tr key={ev.id} className="border-b">
                    <td className="p-2">{ev.date}</td>
                    <td className="p-2">{ev.subjective}</td>
                    <td className="p-2">{ev.objective}</td>
                    <td className="p-2">{ev.assessment}</td>
                    <td className="p-2">{ev.plan}</td>
                    <td className="p-2 text-center">{ev.pain_scale ?? '-'}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(ev)}>Editar</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(ev.id)}>Borrar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Modal/Formulario de evolución */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
                <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-700" onClick={() => setShowForm(false)}>&times;</button>
                <h3 className="text-lg font-bold mb-4">{editingEvolution ? 'Editar Evolución' : 'Nueva Evolución'}</h3>
                <EvolutionForm
                  onSubmit={handleFormSubmit}
                  initialValues={editingEvolution || { patientId, date: '', subjective: '', objective: '', assessment: '', plan: '', pain_scale: '' }}
                  patients={[patient]}
                  isEdit={!!editingEvolution}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
