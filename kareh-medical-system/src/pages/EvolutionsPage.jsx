import React, { useEffect, useState } from 'react';

import EvolutionForm from '../components/evolutions/EvolutionForm';
import toast from 'react-hot-toast';
import { getPatients } from '@/services/patients.service';
import { getDoctors } from '@/services/doctors.service';
import { createEvolution } from '@/services/evolutions.service';

export default function EvolutionsPage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getPatients().then(setPatients).catch(() => setPatients([]));
    getDoctors().then(setDoctors).catch(() => setDoctors([]));
  }, []);

  const handleSubmit = async (values) => {
    try {
      await createEvolution(values);
      toast.success('Evolución registrada correctamente');
    } catch (err) {
      toast.error('Error al registrar la evolución');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Evolución Médica</h1>
      <EvolutionForm onSubmit={handleSubmit} patients={patients} doctors={doctors} />
    </div>
  );
}
