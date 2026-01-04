import React from 'react';
import { useParams } from 'react-router-dom';
import PatientDetailPage from './PatientDetail.jsx';

export default function PatientDetailRoute() {
  const { id } = useParams();
  return <PatientDetailPage patientId={id} />;
}
