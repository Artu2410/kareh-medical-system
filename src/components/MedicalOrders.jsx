import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import medicalOrdersService from '@/services/medicalOrders.service';

const statusConfig = {
  pending_review: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-4 h-4" /> },
  approved: { label: 'Aprobada', color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="w-4 h-4" /> },
  rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-4 h-4" /> },
  expired: { label: 'Expirada', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <XCircle className="w-4 h-4" /> },
  requires_info: { label: 'Info requerida', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <AlertTriangle className="w-4 h-4" /> },
};

const MedicalOrderCard = ({ order, onApprove, onReject }) => {
  const config = statusConfig[order.status] || statusConfig.expired;
  return (
    <Card className={`hover:shadow-lg transition-shadow border-l-4 ${config.color.replace('bg-', 'border-')}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-bold text-slate-800">{order.diagnosis}</CardTitle>
            <p className="text-sm text-slate-600">Paciente: {order.patient_name} ({order.health_insurance_name})</p>
          </div>
          <Badge className={`px-2 py-1 text-xs font-semibold ${config.color} flex items-center gap-1`}>
            {config.icon}
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
            <span className="text-slate-500">Dr. Derivante:</span>
            <span className="font-medium text-slate-700">{order.referring_doctor}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-slate-500">Sesiones Prescritas:</span>
            <span className="font-bold text-teal-600 text-base">{order.prescribed_sessions}</span>
        </div>
         <div className="flex justify-between">
            <span className="text-slate-500">Fecha Orden:</span>
            <span className="font-medium text-slate-700">{format(parseISO(order.order_date), 'dd/MM/yyyy')}</span>
        </div>
        {order.status === 'approved' && (
             <div className="flex justify-between text-green-600">
                <span className="font-medium">Autorización:</span>
                <span className="font-bold">{order.authorization_number}</span>
            </div>
        )}
        {order.status === 'rejected' && (
             <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md"><span className='font-bold'>Motivo: </span>{order.rejection_reason}</p>
        )}
        {order.status === 'pending_review' && (
            <div className="flex gap-2 pt-2 border-t border-slate-200">
                <Button onClick={() => onApprove(order.id)} size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white gap-2">
                    <CheckCircle className="w-4 h-4" /> Aprobar
                </Button>
                <Button onClick={() => onReject(order.id)} size="sm" variant="outline" className="flex-1 gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700">
                    <XCircle className="w-4 h-4" /> Rechazar
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

const MedicalOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending_review');
  const [modal, setModal] = useState({ open: false, type: null, order: null });
  const [approvedSessions, setApprovedSessions] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    medicalOrdersService.getMedicalOrders()
      .then(data => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  }, [orders, activeTab]);

  // Abrir modal de aprobación
  const handleApprove = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setApprovedSessions(order.prescribed_sessions);
    setModal({ open: true, type: 'approve', order });
  };

  // Abrir modal de rechazo
  const handleReject = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setRejectionReason('');
    setModal({ open: true, type: 'reject', order });
  };

  // Confirmar aprobación
  const confirmApprove = async () => {
    await medicalOrdersService.approveOrder(modal.order.id, approvedSessions);
    const data = await medicalOrdersService.getMedicalOrders();
    setOrders(data);
    setModal({ open: false, type: null, order: null });
  };

  // Confirmar rechazo
  const confirmReject = async () => {
    if (!rejectionReason.trim()) return;
    await medicalOrdersService.rejectOrder(modal.order.id, rejectionReason);
    const data = await medicalOrdersService.getMedicalOrders();
    setOrders(data);
    setModal({ open: false, type: null, order: null });
  };

  const tabs = [
    { id: 'pending_review', label: 'Pendientes' },
    { id: 'approved', label: 'Aprobadas' },
    { id: 'rejected', label: 'Rechazadas' },
    { id: 'all', label: 'Todas' },
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`$ {
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
            >
              {tab.label} ({tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length})
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <span className="text-slate-500">Cargando órdenes médicas...</span>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <MedicalOrderCard key={order.id} order={order} onApprove={handleApprove} onReject={handleReject} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
             <FileText className="mx-auto h-12 w-12 text-slate-400" />
             <h3 className="mt-2 text-sm font-medium text-slate-900">No hay órdenes médicas</h3>
             <p className="mt-1 text-sm text-slate-500">No se encontraron órdenes en la categoría "{tabs.find(t=>t.id === activeTab)?.label}".</p>
          </div>
        )}
      </div>

      {/* Modal de aprobación/rechazo */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, type: null, order: null })}
        title={modal.type === 'approve' ? 'Aprobar Orden Médica' : 'Rechazar Orden Médica'}
      >
        {modal.type === 'approve' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Sesiones aprobadas</label>
              <Input
                type="number"
                min={1}
                max={modal.order?.prescribed_sessions}
                value={approvedSessions}
                onChange={e => setApprovedSessions(Number(e.target.value))}
              />
            </div>
            <Button
              onClick={confirmApprove}
              className="w-full bg-green-600 text-white mt-4"
            >
              Confirmar aprobación
            </Button>
          </div>
        )}
        {modal.type === 'reject' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Motivo de rechazo</label>
              <Input
                type="text"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Ingrese el motivo..."
              />
            </div>
            <Button
              onClick={confirmReject}
              className="w-full bg-red-600 text-white mt-4"
              disabled={!rejectionReason.trim()}
            >
              Confirmar rechazo
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicalOrders;
