import React from 'react';
import toast from 'react-hot-toast';
import { getPatients } from '@/services/patients.service';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { X } from 'lucide-react';

const getInitialFormData = (patient) => {
  const defaults = {
    firstName: '',
    lastName: '',
    dni: '',
    dob: '',
    email: '',
    gender: 'M',
    phone: '',
    address: '',
    hasCancer: false,
    hasPacemaker: false,
    hasBypass: false,
    socialWorkId: '',
  };

  if (!patient) return defaults;

  return {
    ...defaults,
    ...patient,
    dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '',
  };
};

export function PatientForm({ patient = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = React.useState(getInitialFormData(patient));
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = async () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.dni.trim()) newErrors.dni = 'El DNI es obligatorio';
    if (!formData.dob) newErrors.dob = 'La fecha de nacimiento es obligatoria';
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.dni && !/^\d{7,}$/.test(formData.dni)) newErrors.dni = 'DNI inválido (solo números, mínimo 7 dígitos)';

    // Validar duplicado de DNI solo si es alta
    if (!patient && formData.dni) {
      try {
        const pacientes = await getPatients();
        if (Array.isArray(pacientes) && pacientes.some(p => p.dni === formData.dni)) {
          newErrors.dni = 'Ya existe un paciente con ese DNI';
        }
      } catch (e) {
        toast.error('No se pudo validar el DNI (error de red)');
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) {
      toast.error('Corrige los errores antes de guardar');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="max-h-[90vh] overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{patient ? 'Editar Paciente' : 'Nuevo Paciente'}</CardTitle>
        <button onClick={onCancel}><X className="w-5 h-5" /></button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} required error={errors.firstName} />
            <Input label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} required error={errors.lastName} />
            <Input label="DNI" name="dni" value={formData.dni} onChange={handleChange} required error={errors.dni} />
            <Input label="Nacimiento" name="dob" type="date" value={formData.dob} onChange={handleChange} required error={errors.dob} />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="hasCancer" checked={formData.hasCancer} onChange={handleChange} /> Cáncer
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="hasPacemaker" checked={formData.hasPacemaker} onChange={handleChange} /> Marcapasos
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="bg-teal-600 text-white">
              {loading ? 'Guardando...' : 'Guardar Paciente'}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline">Cancelar</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}