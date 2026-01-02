import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { searchPatientByDni } from '@/services'

export function WizardStepPatient({
  selectedPatient,
  onSelectPatient,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    dob: '',
    phone: ''
  })

  const handleSearchByDni = async (dni) => {
    if (!dni || dni.trim().length < 5) {
      setError('Ingresa un DNI válido')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const patient = await searchPatientByDni(dni)
      if (patient) {
        onSelectPatient(patient)
        setSearchQuery('')
      } else {
        setError('Paciente no encontrado. ¿Deseas crear uno nuevo?')
        setShowForm(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePatient = () => {
    if (!newPatient.firstName || !newPatient.lastName || !newPatient.dni || !newPatient.dob) {
      setError('Completa todos los campos requeridos')
      return
    }
    
    onSelectPatient({
      id: `temp-${Date.now()}`,
      ...newPatient
    })
    setShowForm(false)
    setNewPatient({ firstName: '', lastName: '', dni: '', dob: '', phone: '' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 1: Seleccionar Paciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPatient ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-800">✓ Paciente seleccionado</p>
            <p className="text-slate-600">{selectedPatient.firstName} {selectedPatient.lastName}</p>
            <p className="text-sm text-slate-500">DNI: {selectedPatient.dni}</p>
            <Button 
              onClick={() => {
                onSelectPatient(null)
                setSearchQuery('')
                setShowForm(false)
              }}
              className="mt-3 bg-red-100 text-red-700 hover:bg-red-200"
            >
              Cambiar paciente
            </Button>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
                placeholder="Ingresa DNI del paciente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchByDni(searchQuery)
                  }
                }}
                className="pl-10"
                disabled={loading}
              />
              <Button
                onClick={() => handleSearchByDni(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={loading}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {showForm && (
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold">Crear nuevo paciente</h3>
                <Input
                  placeholder="Nombre"
                  value={newPatient.firstName}
                  onChange={(e) => setNewPatient({...newPatient, firstName: e.target.value})}
                />
                <Input
                  placeholder="Apellido"
                  value={newPatient.lastName}
                  onChange={(e) => setNewPatient({...newPatient, lastName: e.target.value})}
                />
                <Input
                  placeholder="DNI"
                  value={newPatient.dni}
                  onChange={(e) => setNewPatient({...newPatient, dni: e.target.value})}
                />
                <Input
                  type="date"
                  value={newPatient.dob}
                  onChange={(e) => setNewPatient({...newPatient, dob: e.target.value})}
                />
                <Input
                  placeholder="Teléfono (opcional)"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                />
                <Button 
                  onClick={handleCreatePatient}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Crear Paciente
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
