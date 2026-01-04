import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import {
  AppointmentWizardSteps,
  AppointmentWizardContent,
  AppointmentWizardActions,
  WizardStepPatient,
  WizardStepDoctor,
  WizardStepDateTime,
  WizardStepConfirmation,
  DailySchedule,
  AppointmentCard,
} from '@/components/appointments'
import { getAppointmentsByDate, addAppointment, getPatientAppointments } from '@/services'
import { formatDate } from '@/lib/utils'

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [wizardData, setWizardData] = useState({
    patient: null,
    doctor: null,
    date: '',
    time: '',
  })

  const steps = [
    { id: 'patient', label: 'Paciente' },
    { id: 'doctor', label: 'Profesional' },
    { id: 'datetime', label: 'Fecha & Hora' },
    { id: 'confirmation', label: 'Confirmación' },
  ]

  // Cargar citas al cambiar la fecha o al montar
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getAppointmentsByDate(selectedDate)
        setAppointments(data || [])
      } catch (err) {
        setError(err.message)
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [selectedDate])

  const handleWizardComplete = async () => {
    if (wizardData.patient && wizardData.doctor && wizardData.date && wizardData.time) {
      try {
        setLoading(true)
        const newAppointment = await addAppointment({
          patient: wizardData.patient,
          professionalId: wizardData.doctor.id,
          dates: [new Date(`${wizardData.date}T${wizardData.time}`).toISOString()],
          diagnosis: wizardData.diagnosis || null,
        })
        
        // Recargar citas después de crear la nueva
        const updatedAppointments = await getAppointmentsByDate(selectedDate)
        setAppointments(updatedAppointments || [])
        
        setShowWizard(false)
        setWizardStep(0)
        setWizardData({ patient: null, doctor: null, date: '', time: '', diagnosis: '' })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agenda Médica"
        subtitle={`Vista del ${formatDate(selectedDate)}`}
        actions={
          <Button onClick={() => setShowWizard(true)} disabled={loading}>
            + Nueva Cita
          </Button>
        }
      />

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700"><strong>Error:</strong> {error}</p>
          </CardContent>
        </Card>
      )}

      {showWizard && (
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="pt-6">
            <AppointmentWizardSteps
              steps={steps}
              currentStep={wizardStep}
              onStepChange={setWizardStep}
              completedSteps={[0, 1, 2, 3].slice(0, wizardStep)}
            />

            <div className="mt-8">
              <AppointmentWizardContent currentStep={wizardStep}>
                {wizardStep === 0 && (
                  <WizardStepPatient
                    selectedPatient={wizardData.patient}
                    onSelectPatient={(patient) =>
                      setWizardData(prev => ({ ...prev, patient }))
                    }
                  />
                )}
                {wizardStep === 1 && (
                  <WizardStepDoctor
                    selectedDoctor={wizardData.doctor}
                    onSelectDoctor={(doctor) =>
                      setWizardData(prev => ({ ...prev, doctor }))
                    }
                  />
                )}
                {wizardStep === 2 && (
                  <WizardStepDateTime
                    selectedDate={wizardData.date}
                    selectedTime={wizardData.time}
                    doctorId={wizardData.doctor?.id}
                    onDateChange={(date) =>
                      setWizardData(prev => ({ ...prev, date }))
                    }
                    onTimeChange={(time) =>
                      setWizardData(prev => ({ ...prev, time }))
                    }
                  />
                )} 
                {wizardStep === 3 && (
                  <WizardStepConfirmation
                    patientData={wizardData.patient}
                    doctorData={wizardData.doctor}
                    appointmentData={{
                      date: wizardData.date,
                      time: wizardData.time,
                    }}
                    onEditStep={setWizardStep}
                  />
                )}
              </AppointmentWizardContent>

              <AppointmentWizardActions
                currentStep={wizardStep}
                totalSteps={steps.length}
                onNext={() => setWizardStep(prev => prev + 1)}
                onPrevious={() => setWizardStep(prev => prev - 1)}
                onComplete={handleWizardComplete}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Cargando citas...</p>
              </CardContent>
            </Card>
          ) : (
            <DailySchedule
              appointments={appointments}
              selectedDate={selectedDate}
            />
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Fecha</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                showActions={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
