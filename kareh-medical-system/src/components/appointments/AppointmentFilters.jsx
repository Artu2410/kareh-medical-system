import { Card, CardContent, CardHeader, CardTitle, Input, Button, Badge } from '@/components/ui'
import { useState } from 'react'
import { X, Search } from 'lucide-react'

export function AppointmentFilters({
  filters,
  onFilterChange,
  statuses,
  doctors,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar por paciente, doctor..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="flex-1 border-0 px-0"
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600 hover:text-slate-900 font-medium text-sm"
          >
            Filtros
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pt-4 border-t border-slate-200"
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Estado
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <Badge
                        key={status}
                        variant={
                          filters.status === status ? 'primary' : 'default'
                        }
                        onClick={() =>
                          onFilterChange(
                            'status',
                            filters.status === status ? null : status
                          )
                        }
                        className="cursor-pointer"
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>

                {doctors && doctors.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Doctor
                    </label>
                    <select
                      value={filters.doctor || ''}
                      onChange={(e) =>
                        onFilterChange('doctor', e.target.value || null)
                      }
                      className="w-full px-3 py-2 rounded-2xl border border-slate-200"
                    >
                      <option value="">Todos</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {Object.values(filters).some((v) => v) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange('reset')}
                  className="mt-4 w-full flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
