import React from 'react';

export function AdvancedFilters({ onFilter }) {
  // Estado local para filtros
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [status, setStatus] = React.useState('');

  const handleFilter = () => {
    onFilter?.({ dateFrom, dateTo, category, status });
  };

  return (
    <div className="glassmorphism p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">Desde</label>
        <input type="date" className="input" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">Hasta</label>
        <input type="date" className="input" value={dateTo} onChange={e => setDateTo(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">Categoría</label>
        <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Todas</option>
          <option value="caja chica">Caja chica</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">Estado</label>
        <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>
      <button className="btn bg-teal-500 text-white rounded-xl px-4 py-2" onClick={handleFilter}>
        Filtrar
      </button>
    </div>
  );
}
