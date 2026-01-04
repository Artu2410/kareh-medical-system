import React, { useState } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// Puedes reemplazar esto por un selector real de pacientes y médicos
const patientsMock = [];
const doctorsMock = [];


const initialState = {
  patientId: '',
  date: '',
  subjective: '',
  objective: '',
  assessment: '',
  plan: '',
  pain_scale: '',
  diagnosis: '',
  notes: '',
  doctor: '',
};


const validate = (values) => {
  const errors = {};
  if (!values.patientId) errors.patientId = 'Paciente requerido';
  if (!values.date) errors.date = 'Fecha requerida';
  if (!values.subjective) errors.subjective = 'Campo S (Subjetivo) requerido';
  if (!values.objective) errors.objective = 'Campo O (Objetivo) requerido';
  if (!values.assessment) errors.assessment = 'Campo A (Valoración) requerido';
  if (!values.plan) errors.plan = 'Campo P (Plan) requerido';
  if (values.pain_scale !== '' && (isNaN(values.pain_scale) || values.pain_scale < 0 || values.pain_scale > 10)) errors.pain_scale = 'Dolor debe ser 0-10';
  if (!values.diagnosis) errors.diagnosis = 'Diagnóstico requerido';
  if (!values.doctor) errors.doctor = 'Médico requerido';
  // Notas puede ser opcional
  return errors;
};

export default function EvolutionForm({ onSubmit, initialValues = initialState, patients = patientsMock, doctors = doctorsMock, isEdit = false }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setLoading(true);
    try {
      await onSubmit(values);
      toast.success(isEdit ? 'Evolución actualizada' : 'Evolución registrada');
      setValues(initialState);
    } catch (err) {
      toast.error('Error al guardar la evolución');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow">
      <div>
        <label className="block font-medium">Paciente *</label>
        <select
          name="patientId"
          value={values.patientId}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.patientId ? 'border-red-500' : ''}`}
        >
          <option value="">Selecciona un paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.patientId && <p className="text-red-500 text-sm">{errors.patientId}</p>}
      </div>
      <div>
        <label className="block font-medium">Fecha *</label>
        <input
          type="date"
          name="date"
          value={values.date}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.date ? 'border-red-500' : ''}`}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>

      <div>
        <label className="block font-medium">S: Subjetivo *</label>
        <textarea
          name="subjective"
          value={values.subjective}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.subjective ? 'border-red-500' : ''}`}
        />
        {errors.subjective && <p className="text-red-500 text-sm">{errors.subjective}</p>}
      </div>
      <div>
        <label className="block font-medium">O: Objetivo *</label>
        <textarea
          name="objective"
          value={values.objective}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.objective ? 'border-red-500' : ''}`}
        />
        {errors.objective && <p className="text-red-500 text-sm">{errors.objective}</p>}
      </div>
      <div>
        <label className="block font-medium">A: Valoración *</label>
        <textarea
          name="assessment"
          value={values.assessment}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.assessment ? 'border-red-500' : ''}`}
        />
        {errors.assessment && <p className="text-red-500 text-sm">{errors.assessment}</p>}
      </div>
      <div>
        <label className="block font-medium">P: Plan *</label>
        <textarea
          name="plan"
          value={values.plan}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.plan ? 'border-red-500' : ''}`}
        />
        {errors.plan && <p className="text-red-500 text-sm">{errors.plan}</p>}
      </div>
      <div>
        <label className="block font-medium">Escala de dolor (0-10)</label>
        <input
          type="number"
          name="pain_scale"
          min="0"
          max="10"
          value={values.pain_scale}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.pain_scale ? 'border-red-500' : ''}`}
        />
        {errors.pain_scale && <p className="text-red-500 text-sm">{errors.pain_scale}</p>}
      </div>
      <div>
        <label className="block font-medium">Diagnóstico *</label>
        <input
          type="text"
          name="diagnosis"
          value={values.diagnosis}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.diagnosis ? 'border-red-500' : ''}`}
        />
        {errors.diagnosis && <p className="text-red-500 text-sm">{errors.diagnosis}</p>}
      </div>
      <div>
        <label className="block font-medium">Notas</label>
        <textarea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block font-medium">Médico *</label>
        <select
          name="doctor"
          value={values.doctor}
          onChange={handleChange}
          className={`w-full border rounded p-2 ${errors.doctor ? 'border-red-500' : ''}`}
        >
          <option value="">Selecciona un médico</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        {errors.doctor && <p className="text-red-500 text-sm">{errors.doctor}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {isEdit ? 'Actualizar' : 'Registrar'}
      </button>
    </form>
  );
}

EvolutionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  patients: PropTypes.array,
  doctors: PropTypes.array,
  isEdit: PropTypes.bool,
};
