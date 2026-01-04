import { useState, useMemo } from 'react'
import { Card, CardContent, Input, Button, Badge } from '@/components/ui'
import { Search, Plus, Filter, X } from 'lucide-react'
import { debounce } from '@/lib/utils'

export function PatientsToolbar({
  patients,
  onSearch,
  onFilter,
  onAddPatient,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: null,
  })

  // Asegura que patients siempre sea un array
  const safePatients = Array.isArray(patients) ? patients : [];

  const handleSearch = useMemo(
    () => debounce((query) => {
      setSearchQuery(query)
      const filtered = safePatients.filter(p =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.email?.toLowerCase().includes(query.toLowerCase()) ||
        (p.phone && p.phone.includes(query))
      )
      onSearch(filtered)
    }, 300),
    [safePatients, onSearch]
  )

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const filtered = safePatients.filter(p => {
      if (newFilters.status && p.status !== newFilters.status) return false
      return true
    })
    onFilter(filtered)
  }

  const clearFilters = () => {
    setFilters({ status: null })
    setSearchQuery('')
    onSearch(safePatients)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== null) || searchQuery

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Actions */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                className="pl-10 flex-1"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Button
              onClick={onAddPatient}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  Estado
                </label>
                <div className="flex gap-2">
                  {['active', 'inactive'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleFilterChange('status', filters.status === status ? null : status)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.status === status
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'active' ? 'Activo' : 'Inactivo'}
                    </button>
                  ))}
                </div>
              </div>


            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-slate-600">Filtros activos:</span>
              {filters.status && (
                <Badge variant="primary" className="cursor-pointer" onClick={() => handleFilterChange('status', null)}>
                  {filters.status === 'active' ? 'Activo' : 'Inactivo'} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar todos
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
