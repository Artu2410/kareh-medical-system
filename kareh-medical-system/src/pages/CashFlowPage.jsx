import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import { TrendingUp, TrendingDown, DollarSign, Plus, X } from 'lucide-react'
import { getCashFlows, createCashFlow } from '@/services'

export function CashFlowPage() {
  const [flows, setFlows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all') // all, income, expense
  
  const initialFormState = {
    type: 'INCOME',
    amount: '',
    concept: '',
    category: 'OTHER',
    method: 'CASH',
    receipt: '',
    notes: '',
    professionalId: '',
    date: new Date().toISOString().split('T')[0]
  }

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  const [formData, setFormData] = useState(initialFormState)

  // Cargar flujos al iniciar o cambiar fechas
  useEffect(() => {
    loadFlows()
  }, [dateRange])

  const loadFlows = async () => {
    setLoading(true);
    setError(null);
    try {
      // Enviamos el string directamente "2026-01-01" 
      // para evitar problemas de zona horaria (Z)
      const data = await getCashFlows({
        startDate: dateRange.start, 
        endDate: dateRange.end
      });
      setFlows(data || []);
    } catch (err) {
      setError(err.message);
      setFlows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // 1. Enviar datos al backend
      await createCashFlow(
        formData.type,
        parseFloat(formData.amount),
        formData.concept,
        formData.method,
        formData.notes,
        formData.category,
        formData.receipt,
        formData.date
      )

      // 2. Limpiar formulario y cerrar
      setFormData(initialFormState)
      setShowForm(false)

      // 3. RECARGAR DATOS: Esto actualiza la lista y el balance automáticamente
      await loadFlows()
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar flujos para la tabla
  const filteredFlows = flows.filter(f => {
    if (filter === 'income') return f.type === 'INCOME'
    if (filter === 'expense') return f.type === 'EXPENSE'
    return true
  })

  // Calcular totales (Se recalculan cada vez que 'flows' cambia)
  const totals = {
    income: flows.filter(f => f.type === 'INCOME').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0),
    expense: flows.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0),
  };
  totals.balance = totals.income - totals.expense

  return (
    <div className="space-y-6">
      <PageHeader
        title="Caja Chica"
        subtitle="Gestión de ingresos y egresos"
        actions={
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Movimiento
          </Button>
        }
      />

      {/* RESUMEN DE TOTALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Ingresos</p>
                <p className="text-3xl font-bold text-green-600">
                  ${totals.income.toLocaleString('es-AR')}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Egresos</p>
                <p className="text-3xl font-bold text-red-600">
                  ${totals.expense.toLocaleString('es-AR')}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-100" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Balance</p>
                <p className={`text-3xl font-bold ${totals.balance >= 0 ? 'text-teal-600' : 'text-red-600'}`}>
                  ${totals.balance.toLocaleString('es-AR')}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-teal-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <Card className="border-teal-200 bg-teal-50">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Nuevo Movimiento de Caja</CardTitle>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Tipo de Movimiento
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Egreso</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Monto ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Método de Pago
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({...formData, method: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="CASH">Efectivo</option>
                    <option value="TRANSFER">Transferencia</option>
                    <option value="CARD">Tarjeta</option>
                    <option value="CHECK">Cheque</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    N° Recibo/Comprobante
                  </label>
                  <Input
                    type="text"
                    value={formData.receipt}
                    onChange={(e) => setFormData({...formData, receipt: e.target.value})}
                    placeholder="Ej: RCP-001234"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Concepto
                  </label>
                  <Input
                    value={formData.concept}
                    onChange={(e) => setFormData({...formData, concept: e.target.value})}
                    placeholder="Descripción rápida"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Descripción/Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Notas adicionales..."
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {loading ? 'Registrando...' : 'Registrar Movimiento'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* FILTROS */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Desde</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Hasta</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">Todos los movimientos</option>
                <option value="income">Solo ingresos</option>
                <option value="expense">Solo egresos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLA DE MOVIMIENTOS */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos ({filteredFlows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && flows.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Cargando...</p>
          ) : filteredFlows.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Sin movimientos en este período</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredFlows.map((flow) => (
                <div
                  key={flow.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        flow.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {flow.type === 'INCOME' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{flow.concept}</p>
                        <p className="text-sm text-slate-500">{flow.method} • {flow.category} • {new Date(flow.createdAt).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      flow.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {flow.type === 'INCOME' ? '+' : '-'} ${Number(flow.amount).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}