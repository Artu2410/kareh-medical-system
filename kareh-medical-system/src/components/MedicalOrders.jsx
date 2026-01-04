import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

// Mock data y estructura inicial
const initialOrders = [
  // Ejemplo: { id: 1, paciente: 'Juan Pérez', tipo: 'Laboratorio', fecha: '2026-01-04', estado: 'Pendiente' }
];

const orderTypes = [
  { value: 'Laboratorio', label: 'Laboratorio' },
  { value: 'Imagen', label: 'Imagen' },
  { value: 'Medicamento', label: 'Medicamento' },
  { value: 'Otro', label: 'Otro' },
];

export default function MedicalOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState('todas');

  // CRUD Handlers
  const handleAdd = () => {
    setEditingOrder({ paciente: '', tipo: '', fecha: '', estado: 'Pendiente' });
    setShowModal(true);
  };
  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };
  const handleDelete = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };
  const handleSave = (order) => {
    if (order.id) {
      setOrders(orders.map(o => (o.id === order.id ? order : o)));
    } else {
      setOrders([...orders, { ...order, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingOrder(null);
  };

  // Filtros y tabs
  const filteredOrders = orders.filter(o =>
    (tab === 'todas' || o.tipo === tab) &&
    (filter === '' || o.paciente.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button onClick={handleAdd}>Nueva Orden</Button>
        </div>
        <Input
          placeholder="Buscar paciente..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-64"
        />
      </div>
      <div className="flex gap-2 mb-4">
        <Button variant={tab === 'todas' ? 'primary' : 'outline'} onClick={() => setTab('todas')}>Todas</Button>
        {orderTypes.map(t => (
          <Button key={t.value} variant={tab === t.value ? 'primary' : 'outline'} onClick={() => setTab(t.value)}>{t.label}</Button>
        ))}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.paciente}</td>
              <td>{order.tipo}</td>
              <td>{order.fecha}</td>
              <td>{order.estado}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(order)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(order.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
          {filteredOrders.length === 0 && (
            <tr><td colSpan={5} className="text-center">Sin órdenes</td></tr>
          )}
        </tbody>
      </table>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <OrderForm order={editingOrder} onSave={handleSave} onCancel={() => setShowModal(false)} />
      </Modal>
    </Card>
  );
}

function OrderForm({ order, onSave, onCancel }) {
  const [form, setForm] = useState(order || {});
  useEffect(() => { setForm(order || {}); }, [order]);
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
        label="Tipo"
        value={form.tipo || ''}
        onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
        options={orderTypes}
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
        value={form.estado || 'Pendiente'}
        onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}
        options={[
          { value: 'Pendiente', label: 'Pendiente' },
          { value: 'Completada', label: 'Completada' },
          { value: 'Cancelada', label: 'Cancelada' },
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
