import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const getHeaders = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export function WizardStepDoctor({ selectedDoctor, onSelectDoctor }) {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/professionals`, {
          headers: getHeaders()
        })

        if (response.status === 401) {
          throw new Error('Sesión expirada. Por favor, reingresa al sistema.')
        }

        if (!response.ok) {
          throw new Error('Error al conectar con el servidor')
        }

        const data = await response.json()
        setProfessionals(Array.isArray(data) ? data : [])
        
      } catch (err) {
        console.error("Fetch error:", err.message)
        setError(err.message)
        
        // Solo cargar estáticos si no es error de sesión
        if (!err.message.includes('Sesión')) {
          setProfessionals([
            { id: '1', firstName: 'Katia', lastName: 'Romero', license: 'MP-10318', specialization: 'Kinesiología' },
            { id: '2', firstName: 'Juan', lastName: 'Pérez', license: 'MN-18900', specialization: 'Fisioterapia' }
          ])
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfessionals()
  }, [])

  return (
    <Card className="animate-fadeIn">
      <CardHeader>
        <CardTitle>Paso 2: Seleccionar Profesional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center py-8">
             <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-slate-500 mt-2 text-sm">Buscando especialistas...</p>
          </div>
        ) : error && professionals.length === 0 ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {professionals.map((professional) => (
              <button
                key={professional.id}
                type="button"
                onClick={() => onSelectDoctor(professional)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedDoctor?.id === professional.id
                    ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-100'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-semibold ${selectedDoctor?.id === professional.id ? 'text-teal-900' : 'text-slate-900'}`}>
                      {professional.firstName} {professional.lastName}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{professional.specialization}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Lic: {professional.license}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedDoctor && !loading && (
          <div className="mt-4 p-3 rounded-lg bg-teal-50 border border-teal-200 animate-slideIn">
            <p className="text-teal-800 text-xs font-medium">✓ Profesional: {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}