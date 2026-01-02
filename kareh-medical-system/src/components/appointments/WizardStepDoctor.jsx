import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useState, useEffect } from 'react'

export function WizardStepDoctor({
  selectedDoctor,
  onSelectDoctor,
}) {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:4000/api/professionals', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
          }
        })
        if (!response.ok) throw new Error('Error al cargar profesionales')
        const data = await response.json()
        setProfessionals(data || [])
      } catch (err) {
        setError(err.message)
        // Datos de fallback
        setProfessionals([
          { id: '1', firstName: 'Katia', lastName: 'Romero', license: 'MP-10318', specialization: 'Kinesiología' },
          { id: '2', firstName: 'Juan', lastName: 'Pérez', license: 'MN-18900', specialization: 'Fisioterapia' }
        ])
      } finally {
        setLoading(false)
      }
    }
    loadProfessionals()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 2: Seleccionar Profesional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-center text-slate-500">Cargando profesionales...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-sm">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {professionals.map((professional) => (
              <button
                key={professional.id}
                onClick={() => onSelectDoctor(professional)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedDoctor?.id === professional.id
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                <p className="font-semibold text-slate-900">
                  {professional.firstName} {professional.lastName}
                </p>
                <p className="text-sm text-slate-600 mt-1">{professional.specialization}</p>
                <p className="text-xs text-slate-500 mt-1">Lic: {professional.license}</p>
              </button>
            ))}
          </div>
        )}

        {selectedDoctor && (
          <div className="mt-6 p-4 rounded-lg bg-teal-50 border border-teal-200">
            <p className="font-semibold text-teal-900">✓ Profesional seleccionado</p>
            <p className="text-sm text-teal-700 mt-2">
              {selectedDoctor.firstName} {selectedDoctor.lastName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
