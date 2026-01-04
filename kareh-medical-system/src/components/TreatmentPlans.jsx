import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

// Mock data y estructura inicial
const initialTreatments = [
  // Ejemplo: { id: 1, paciente: 'Juan Pérez', tratamiento: 'Fisioterapia', fecha: '2026-01-04', estado: 'Activo' }
];

const treatmentTypes = [
  { value: 'Fisioterapia', label: 'Fisioterapia' },
  { value: 'Medicamento', label: 'Medicamento' },
  { value: 'Cirugía', label: 'Cirugía' },
  { value: 'Otro', label: 'Otro' },
];

export default function TreatmentPlans() {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [showModal, setShowModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('todos');

  // CRUD Handlers
  const handleAdd = () => {
    setEditingTreatment({ paciente: '', tratamiento: '', fecha: '', estado: 'Activo' });
    setShowModal(true);
  };
  const handleEdit = (treatment) => {
    setEditingTreatment(treatment);
    setShowModal(true);
  };
  const handleDelete = (id) => {
    setTreatments(treatments.filter(t => t.id !== id));
  };
  const handleSave = (treatment) => {
    if (treatment.id) {
      setTreatments(treatments.map(t => (t.id === treatment.id ? treatment : t)));
    } else {
      setTreatments([...treatments, { ...treatment, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingTreatment(null);
  };

  // Filtros y tabs
  const filteredTreatments = treatments.filter(t =>
    (tab === 'todos' || t.tratamiento === tab) &&
    (filter === '' || t.paciente.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button onClick={handleAdd}>Nuevo Tratamiento</Button>
        </div>
        <Input
          placeholder="Buscar paciente..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-64"
        />
      </div>
      <div className="flex gap-2 mb-4">
        <Button variant={tab === 'todos' ? 'primary' : 'outline'} onClick={() => setTab('todos')}>Todos</Button>
        {treatmentTypes.map(t => (
          <Button key={t.value} variant={tab === t.value ? 'primary' : 'outline'} onClick={() => setTab(t.value)}>{t.label}</Button>
        ))}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Tratamiento</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredTreatments.map(treatment => (
            <tr key={treatment.id}>
              <td>{treatment.paciente}</td>
              <td>{treatment.tratamiento}</td>
              <td>{treatment.fecha}</td>
              <td>{treatment.estado}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(treatment)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(treatment.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
          {filteredTreatments.length === 0 && (
            <tr><td colSpan={5} className="text-center">Sin tratamientos</td></tr>
          )}
        </tbody>
      </table>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <TreatmentForm treatment={editingTreatment} onSave={handleSave} onCancel={() => setShowModal(false)} />
      </Modal>
    </Card>
  );
}

function TreatmentForm({ treatment, onSave, onCancel }) {
  const [form, setForm] = useState(treatment || {});
  useEffect(() => { setForm(treatment || {}); }, [treatment]);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
      className="flex flex-col gap-2"
    >
      <Input
        label="Paciente"
        value={form.paciente || ''}
        onChange={e => setForm(f => ({ ...f, paciente: e.target.value }))}
        required
      />
      <Select
        label="Tratamiento"
        value={form.tratamiento || ''}
        onChange={e => setForm(f => ({ ...f, tratamiento: e.target.value }))}
        options={treatmentTypes}
        required
      />
      <Input
        label="Fecha"
        type="date"
        value={form.fecha || ''}
        onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
        required
      />
      <Select
        label="Estado"
        value={form.estado || 'Activo'}
        onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
        options={[
          { value: 'Activo', label: 'Activo' },
          { value: 'Finalizado', label: 'Finalizado' },
          { value: 'Suspendido', label: 'Suspendido' },
        ]}
        required
      />
      <div className="flex gap-2 mt-2">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
