import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import { CheckCircle } from 'lucide-react'

export function WizardStepConfirmation({
  patientData,
  doctorData,
  appointmentData,
  onEditStep,
}) {
  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            Resumen de la Cita
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Section */}
          <div className="pb-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Paciente</h3>
            <p className="text-slate-700">{patientData.name}</p>
            <p className="text-sm text-slate-500">{patientData.email}</p>
            <p className="text-sm text-slate-500">{patientData.phone}</p>
            <button
              onClick={() => onEditStep(0)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
            >
              Cambiar paciente
            </button>
          </div>

          {/* Doctor Section */}
          <div className="pb-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3">Profesional</h3>
            <p className="text-slate-700">{doctorData.name}</p>
            <p className="text-sm text-slate-500">{doctorData.specialty}</p>
            <button
              onClick={() => onEditStep(1)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
            >
              Cambiar profesional
            </button>
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Detalles de la Cita</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Fecha:</span>
                <span className="font-medium text-slate-900">
                  {new Date(appointmentData.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Hora:</span>
                <span className="font-medium text-slate-900">{appointmentData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Duración:</span>
                <span className="font-medium text-slate-900">30 minutos</span>
              </div>
            </div>
            <button
              onClick={() => onEditStep(2)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-3"
            >
              Cambiar fecha y hora
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="Motivo de la consulta, síntomas a reportar, etc."
            rows="4"
            className="w-full px-4 py-2 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </CardContent>
      </Card>
    </div>
  )
}
