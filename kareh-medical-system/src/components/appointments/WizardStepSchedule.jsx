import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { calculatePackageDates } from './useSessionGenerator'; // <--- Verifica esta ruta
import { createAppointmentPackage } from '../../services/appointments.service';

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
    // Importante: le pasamos los días seleccionados para el cálculo
    const dates = calculatePackageDates(new Date(startDate), selectedDays);
    setPreviewDates(dates);
  }, [startDate, selectedDays]);

  const toggleDay = (id) => {
    setSelectedDays(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleFinalConfirm = async () => {
    if (!diagnosisText.trim()) {
      alert("Por favor, ingresa un diagnóstico previo.");
      return;
    }

    try {
      setIsSubmitting(true);
      const dataToSend = {
        patient: patient,
        docId: docId,
        previewDates: previewDates,
        time: time,
        diagnosis: diagnosisText
      };

      const response = await createAppointmentPackage(dataToSend);
      
      if (response.success) {
        alert("✅ ¡Las 10 sesiones se guardaron correctamente!");
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ No se pudo guardar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <h3 className="text-lg font-bold text-teal-800 mb-4">Programación de Plan (10 Sesiones)</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-slate-500 mb-1">Fecha de Inicio</label>
          <input 
            type="date" 
            className="w-full p-2 border rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-500 mb-1">Horario</label>
          <select className="w-full p-2 border rounded-md" value={time} onChange={(e)=>setTime(e.target.value)}>
            <option value="08:00">08:00 AM</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="16:00">04:00 PM</option>
            <option value="17:00">05:00 PM</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-slate-500 mb-2">Días de la semana</label>
        <div className="flex gap-2">
          {weekDays.map(day => (
            <button
              key={day.id}
              type="button"
              onClick={() => toggleDay(day.id)}
              className={`w-10 h-10 rounded-full font-bold transition-all ${
                selectedDays.includes(day.id) 
                ? 'bg-teal-600 text-white shadow-md scale-110' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-slate-500 mb-1">Diagnóstico / Motivo de Consulta</label>
        <textarea 
          className="w-full p-3 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-teal-500 outline-none"
          placeholder="Ej: Paciente con lumbalgia crónica..."
          value={diagnosisText}
          onChange={(e) => setDiagnosisText(e.target.value)}
        />
      </div>

      <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300 mb-6">
        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Previsualización de Sesiones</h4>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {previewDates.map((date, index) => (
            <div key={index} className="text-xs p-2 bg-white border rounded flex justify-between">
              <span className="font-medium text-teal-700">#{index + 1}</span>
              <span>{format(date, 'dd/MM/yyyy')}</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleFinalConfirm}
        disabled={isSubmitting}
        className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
          isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'
        }`}
      >
        {isSubmitting ? 'Guardando...' : 'Finalizar y Agendar 10 Sesiones'}
      </button>
    </div>
  );
};

export default WizardStepSchedule;