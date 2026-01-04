import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { format } from 'date-fns';

// IMPORTACIÓN DE TUS SERVICIOS
import { 
  getAppointmentsByDate, 
  createAppointmentPackage,
  deleteAppointment // Asegúrate de agregar esta exportación en tu service
} from '@/services/appointments.service';
import { calculatePackageDates } from '@/components/appointments/useSessionGenerator';
import { formatDate } from '@/lib/utils';

// --- WIZARD COMPONENT ---
const WizardStepSchedule = ({ patient, docId, onComplete }) => {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedDays, setSelectedDays] = useState([1, 3, 5]); 
  const [time, setTime] = useState("08:00");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [previewDates, setPreviewDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekDays = [
    { id: 1, label: 'L' }, { id: 2, label: 'M' }, { id: 3, label: 'X' },
    { id: 4, label: 'J' }, { id: 5, label: 'V' }, { id: 6, label: 'S' }
  ];

  useEffect(() => {
    const dates = calculatePackageDates(new Date(startDate), selectedDays);
    setPreviewDates(dates);
  }, [startDate, selectedDays]);

  const [diagnosisError, setDiagnosisError] = useState("");
  const handleFinalConfirm = async () => {
    if (!diagnosisText.trim()) {
      setDiagnosisError("El diagnóstico es obligatorio");
      toast.error("Por favor, ingresa un diagnóstico previo.");
      return;
    } else {
      setDiagnosisError("");
    }
    try {
      setIsSubmitting(true);
      const response = await createAppointmentPackage({
        patient,
        docId: docId || "1",
        previewDates,
        time,
        diagnosis: diagnosisText
      });
      if (response.success) {
        toast.success("¡Plan agendado!");
        if (onComplete) onComplete();
      }
    } catch (error) {
      toast.error("Error: " + (error?.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl">
      <h3 className="text-lg font-bold text-teal-800 mb-4">Programación de Plan (10 Sesiones)</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <select className="p-2 border rounded" value={time} onChange={(e)=>setTime(e.target.value)}>
          <option value="08:00">08:00 AM</option>
          <option value="09:00">09:00 AM</option>
          <option value="16:00">04:00 PM</option>
        </select>
      </div>
      <div className="flex gap-2 mb-6">
        {weekDays.map(day => (
          <button
            key={day.id}
            onClick={() => setSelectedDays(prev => prev.includes(day.id) ? prev.filter(d => d !== day.id) : [...prev, day.id])}
            className={`w-10 h-10 rounded-full font-bold transition-colors ${selectedDays.includes(day.id) ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            {day.label}
          </button>
        ))}
      </div>
      <textarea 
        className={`w-full p-3 border rounded-lg mb-2 focus:ring-2 focus:ring-teal-500 outline-none ${diagnosisError ? 'border-red-500' : ''}`}
        placeholder="Diagnóstico..." 
        value={diagnosisText} 
        onChange={(e) => { setDiagnosisText(e.target.value); if (diagnosisError) setDiagnosisError(""); }}
      />
      {diagnosisError && <p className="text-red-600 text-sm mb-4 font-medium">{diagnosisError}</p>}
      <button onClick={handleFinalConfirm} disabled={isSubmitting} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg transition-all">
        {isSubmitting ? 'Guardando...' : 'Confirmar y Agendar 10 Sesiones'}
      </button>
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
export function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPackageWizard, setShowPackageWizard] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointmentsByDate(selectedDate);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando citas:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      try {
        await deleteAppointment(id);
        setAppointments(prev => prev.filter(app => app.id !== id));
        toast.success("Cita eliminada correctamente");
      } catch (error) {
        toast.error("Error al eliminar la cita: " + (error?.message || error));
      }
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agenda Médica"
        subtitle={`Vista del ${formatDate(selectedDate)}`}
        action={
          <Button onClick={() => setShowPackageWizard(true)} className="bg-teal-600 hover:bg-teal-700 text-white shadow-md">
            + Nuevo Plan (10 Sesiones)
          </Button>
        }
      />

      {showPackageWizard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowPackageWizard(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <WizardStepSchedule 
              onComplete={() => {
                setShowPackageWizard(false);
                loadAppointments();
              }} 
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-slate-800">Citas del Día</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
                <p className="text-slate-500 italic">Actualizando agenda...</p>
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((app) => (
                  <div key={app.id} className="p-4 border-l-4 border-teal-500 bg-white rounded-r-lg flex justify-between items-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-teal-700">{app.slot} hs</span>
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] rounded-full font-bold uppercase tracking-wider">
                          {app.therapyType}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 text-md">
                        {app.patient?.firstName} {app.patient?.lastName}
                      </p>
                      <p className="text-sm text-slate-500">{app.diagnosis}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        Prof: {app.professional?.firstName || 'Sin asignar'}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 border-red-100 hover:bg-red-50 h-8 px-3"
                          onClick={() => handleDelete(app.id)}
                        >
                          Eliminar
                        </Button>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white h-8 px-3">
                          Atender
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <div className="text-slate-300 text-5xl mb-4">📅</div>
                <p className="text-slate-400 font-medium">No hay citas para esta fecha.</p>
                <p className="text-slate-300 text-sm">Usa el botón "+ Nuevo Plan" para empezar.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm h-fit">
          <CardHeader><CardTitle className="text-lg text-slate-700">Calendario</CardTitle></CardHeader>
          <CardContent>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="cursor-pointer border-slate-200 focus:border-teal-500"
            />
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 leading-relaxed">
                Selecciona una fecha para ver la disponibilidad y gestionar los turnos de kinesiología.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}