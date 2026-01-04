import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { DollarSign, Plus, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
// Importamos el servicio
import { createCashFlow, getCashFlows } from '@/services/cashflow.service';

export function CashFlowPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState({
    type: 'INCOME',
    category: 'OTHER',
    amount: '',
    description: '',
    method: 'CASH', // Valor por defecto necesario para tu servicio
    date: new Date().toISOString().split('T')[0],
  });

  // Cargar movimientos al iniciar
  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      const data = await getCashFlows();
      setMovements(data);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Llamamos al servicio con los parámetros en el orden correcto
      // createCashFlow(type, amount, concept, method, notes, category, receipt, date)
      await createCashFlow(
        form.type,
        form.amount,
        form.description, // Se usa como 'concept'
        form.method,
        '', // notes
        form.category,
        null, // receipt
        form.date
      );

      // Si tiene éxito:
      setShowModal(false);
      setForm({
        type: 'INCOME',
        category: 'OTHER',
        amount: '',
        description: '',
        method: 'CASH',
        date: new Date().toISOString().split('T')[0],
      });
      
      // Recargamos la lista
      loadMovements();
      alert('Movimiento registrado correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert(error.message || 'Error al registrar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Caja Chica"
        description="Controla los ingresos y egresos de la clínica."
        icon={<DollarSign className="w-8 h-8 text-teal-600" />}
        actions={
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-5 h-5" />
            Nuevo Movimiento
          </Button>
        }
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo Movimiento de Caja"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Tipo</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
              >
                <option value="INCOME">Ingreso</option>
                <option value="EXPENSE">Egreso</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Categoría</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
              >
                <option value="SALARY">Salarios</option>
                <option value="CONSULTATION">Consultas</option>
                <option value="SUPPLIES">Suministros</option>
                <option value="UTILITIES">Servicios/Utilidades</option>
                <option value="RENT">Alquiler</option>
                <option value="STAFF">Personal</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Monto ($)</label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Método de Pago</label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
              >
                <option value="CASH">Efectivo</option>
                <option value="TRANSFER">Transferencia</option>
                <option value="CARD">Tarjeta</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Fecha</label>
              <Input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Descripción / Concepto</label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ej: Pago de alquiler mes Octubre"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white min-w-[100px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <Card>
        <CardHeader>
          <CardTitle>Movimientos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Concepto</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium">{m.concept || m.description}</td>
                      <td className="px-4 py-3 text-slate-500">{m.category}</td>
                      <td className={`px-4 py-3 text-right font-bold ${m.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                        {m.type === 'INCOME' ? '+' : '-'} ${parseFloat(m.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No hay movimientos registrados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CashFlowPage;