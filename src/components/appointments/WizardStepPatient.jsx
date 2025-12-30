import { Card, CardContent, CardHeader, CardTitle, Select, Input, Button } from '@/components/ui'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { getPatients, searchPatients } from '@/services/patients.service'

export function WizardStepPatient({
  selectedPatient,
  onSelectPatient,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [patients, setPatients] = useState(getPatients())

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchPatients(query)
      setPatients(results)
    } else {
      setPatients(getPatients())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 1: Seleccionar Paciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Buscar paciente por nombre, email o teléfono..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                selectedPatient?.id === patient.id
                  ? 'border-teal-600 bg-teal-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="font-semibold text-slate-900">{patient.name}</p>
              <p className="text-sm text-slate-500">{patient.email}</p>
              <p className="text-sm text-slate-500">{patient.phone}</p>
            </button>
          ))}
        </div>

        {patients.length === 0 && searchQuery && (
          <p className="text-center text-slate-500 py-8">
            No se encontraron pacientes
          </p>
        )}

        {!searchQuery && patients.length === 0 && (
          <p className="text-center text-slate-500 py-8">
            No hay pacientes registrados
          </p>
        )}
      </CardContent>
    </Card>
  )
}
