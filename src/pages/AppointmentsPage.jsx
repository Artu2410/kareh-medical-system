import { useState } from 'react'
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
import { getAppointments, getAppointmentsByDate, addAppointment } from '@/services'
import { formatDate } from '@/lib/utils'

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState(getAppointments())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)

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

  const todayAppointments = getAppointmentsByDate(selectedDate)

  const handleWizardComplete = () => {
    if (wizardData.patient && wizardData.doctor && wizardData.date && wizardData.time) {
      const newAppointment = addAppointment({
        patientId: wizardData.patient.id,
        patientName: wizardData.patient.name,
        doctorId: wizardData.doctor.id,
        doctorName: wizardData.doctor.name,
        date: wizardData.date,
        time: wizardData.time,
        duration: 30,
        reason: 'Consulta',
        status: 'confirmed',
      })
      setAppointments(prev => [...prev, newAppointment])
      setShowWizard(false)
      setWizardStep(0)
      setWizardData({ patient: null, doctor: null, date: '', time: '' })
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agenda Médica"
        subtitle={`Vista del ${formatDate(selectedDate)}`}
        action={
          <Button onClick={() => setShowWizard(true)}>
            + Nueva Cita
          </Button>
        }
      />

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
          <DailySchedule
            appointments={todayAppointments}
            selectedDate={selectedDate}
          />
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
