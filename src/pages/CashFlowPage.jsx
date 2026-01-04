import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { DollarSign, Plus, Loader2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { createCashFlow, getCashFlows } from '@/services/cashflow.service';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CashFlowCharts from '@/components/cashflow/CashFlowCharts';

export function CashFlowPage() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [movements, setMovements] = useState([]);
  const [balance, setBalance] = useState({ income: 0, expense: 0, total: 0 });
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [form, setForm] = useState({
    type: 'INCOME',
    category: 'OTHER',
    amount: '',
    concept: '',
    method: 'CASH',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  /**
   * Cargar movimientos al montar y cuando cambie el filtro
   */
  useEffect(() => {
    loadMovements();
  }, [dateFilter]);

  /**
   * Cargar movimientos desde el backend
   */
  const loadMovements = async () => {
    setLoadingData(true);
    try {
      const data = await getCashFlows({
        startDate: dateFilter.startDate,
        endDate: dateFilter.endDate
      });

      setMovements(data || []);

      // Calcular balance
      const income = data.filter(m => m.type === 'INCOME').reduce((sum, m) => sum + parseFloat(m.amount), 0);
      const expense = data.filter(m => m.type === 'EXPENSE').reduce((sum, m) => sum + parseFloat(m.amount), 0);
      
      setBalance({
        income,
        expense,
        total: income - expense
      });
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
      toast.error('❌ Error al cargar movimientos', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Guardar nuevo movimiento
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.amount || parseFloat(form.amount) <= 0) {
      toast.error('❌ El monto debe ser mayor a 0', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!form.concept.trim()) {
      toast.error('❌ Debes ingresar un concepto', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      await createCashFlow(
        form.type,
        parseFloat(form.amount),
        form.concept,
        form.method,
        form.notes || null,
        form.category,
        null, // receipt
        form.date
      );

      toast.success('✅ Movimiento registrado correctamente', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Resetear formulario
      setForm({
        type: 'INCOME',
        category: 'OTHER',
        amount: '',
        concept: '',
        method: 'CASH',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });

      setShowModal(false);
      loadMovements(); // Recargar lista
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(`❌ ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambiar rango de fechas
   */
  const handleDateFilterChange = (field, value) => {
    setDateFilter(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <ToastContainer />

      <div className="space-y-6">
        {/* HEADER */}
        <PageHeader
          title="💰 Caja Chica"
          subtitle="Controla los ingresos y egresos de tu centro médico"
        />

        {/* CARDS DE BALANCE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* INGRESOS */}
          <Card className="border-l-4 border-green-500 hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Ingresos
                  </p>
                  <h3 className="text-3xl font-bold text-green-600 mt-2">
                    ${balance.income.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EGRESOS */}
          <Card className="border-l-4 border-red-500 hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Egresos
                  </p>
                  <h3 className="text-3xl font-bold text-red-600 mt-2">
                    ${balance.expense.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="bg-red-100 p-4 rounded-full">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BALANCE NETO */}
          <Card className={`border-l-4 ${balance.total >= 0 ? 'border-teal-500' : 'border-red-500'} hover:shadow-xl transition-all`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Balance
                  </p>
                  <h3 className={`text-3xl font-bold mt-2 ${balance.total >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                    ${balance.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className={`${balance.total >= 0 ? 'bg-teal-100' : 'bg-red-100'} p-4 rounded-full`}>
                  <DollarSign className={`w-8 h-8 ${balance.total >= 0 ? 'text-teal-600' : 'text-red-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS Y NUEVO MOVIMIENTO */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Filtro de fechas */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    📅 Desde
                  </label>
                  <Input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    📅 Hasta
                  </label>
                  <Input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Botón nuevo movimiento */}
              <Button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-teal-600 to-teal-500 hover:shadow-xl hover:shadow-teal-500/30 text-white px-6 py-3 font-semibold gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Movimiento
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GRÁFICOS */}
        <CashFlowCharts transactions={movements} />

        {/* TABLA DE MOVIMIENTOS */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Movimientos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
                <p className="text-slate-500 mt-4">Cargando movimientos...</p>
              </div>
            ) : movements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">Fecha</th>
                      <th className="px-4 py-3 text-left">Tipo</th>
                      <th className="px-4 py-3 text-left">Concepto</th>
                      <th className="px-4 py-3 text-left">Categoría</th>
                      <th className="px-4 py-3 text-left">Método</th>
                      <th className="px-4 py-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((m, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          {new Date(m.createdAt).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            m.type === 'INCOME' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {m.type === 'INCOME' ? '↗ Ingreso' : '↘ Egreso'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{m.concept}</td>
                        <td className="px-4 py-3 text-slate-500">{m.category}</td>
                        <td className="px-4 py-3 text-slate-500">{m.method}</td>
                        <td className={`px-4 py-3 text-right font-bold ${
                          m.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {m.type === 'INCOME' ? '+' : '-'} ${parseFloat(m.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay movimientos registrados en este período.</p>
                <Button onClick={() => setShowModal(true)} className="mt-4">
                  Registrar Primer Movimiento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MODAL FORMULARIO */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="💵 Nuevo Movimiento de Caja"
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Tipo de Movimiento
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="INCOME">💰 Ingreso</option>
                  <option value="EXPENSE">💸 Egreso</option>
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Categoría
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="SALARY">💼 Salarios</option>
                  <option value="CONSULTATION">🏥 Consultas</option>
                  <option value="SUPPLIES">📦 Suministros</option>
                  <option value="UTILITIES">⚡ Servicios</option>
                  <option value="RENT">🏢 Alquiler</option>
                  <option value="STAFF">👥 Personal</option>
                  <option value="OTHER">📌 Otro</option>
                </select>
              </div>

              {/* Monto */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Monto ($) *
                </label>
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

              {/* Método */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Método de Pago
                </label>
                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="CASH">💵 Efectivo</option>
                  <option value="TRANSFER">🏦 Transferencia</option>
                  <option value="CARD">💳 Tarjeta</option>
                </select>
              </div>

              {/* Fecha */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Fecha
                </label>
                <Input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Concepto */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Concepto / Descripción *
                </label>
                <Input
                  name="concept"
                  value={form.concept}
                  onChange={handleChange}
                  placeholder="Ej: Pago de alquiler mes Octubre"
                  required
                />
              </div>

              {/* Notas */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  placeholder="Información adicional..."
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white min-h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  '💾 Guardar Movimiento'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}

export default CashFlowPage;