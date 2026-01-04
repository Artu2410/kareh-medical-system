import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui'
import { Settings, Save, AlertCircle } from 'lucide-react'

export function SettingsPage() {
  const [settings, setSettings] = useState({
    // Configuración de turnos
    maxAppointmentsPerSlot: '5',
    slotDuration: '30',
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    
    // Configuración de paquetes
    packageSessionCount: '10',
    
    // Configuración del sistema
    clinicName: 'Centro de Kinesiología KAREH',
    clinicAddress: '',
    clinicPhone: '',
    clinicEmail: '',
    clinicWebsite: '',
    
    // Configuración de profesionales
    defaultSpecialization: 'Kinesiología',
    
    // Configuración de notificaciones
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    appointmentReminderMinutes: '24',
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('appointments')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      // Aquí irían las llamadas a la API para guardar configuraciones
      // Por ahora guardamos en localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'appointments', label: '📅 Turnos', icon: '📅' },
    { id: 'clinic', label: '🏥 Clínica', icon: '🏥' },
    { id: 'professionals', label: '👨‍⚕️ Profesionales', icon: '👨‍⚕️' },
    { id: 'notifications', label: '🔔 Notificaciones', icon: '🔔' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuraciones"
        subtitle="Gestiona la configuración del sistema"
        action={
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>
        }
      />

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
          Configuración guardada correctamente
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO POR TAB */}
      <div>
        {/* TAB: TURNOS */}
        {activeTab === 'appointments' && (
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Turnos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Máximo de citas por horario
                  </label>
                  <Input
                    type="number"
                    name="maxAppointmentsPerSlot"
                    value={settings.maxAppointmentsPerSlot}
                    onChange={handleChange}
                    min="1"
                    max="20"
                  />
                  <p className="text-xs text-slate-500 mt-1">Máximo número de pacientes por slot</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Duración de cada turno (minutos)
                  </label>
                  <Input
                    type="number"
                    name="slotDuration"
                    value={settings.slotDuration}
                    onChange={handleChange}
                    min="15"
                    max="120"
                  />
                  <p className="text-xs text-slate-500 mt-1">Duración de cada turno en minutos</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Hora de inicio de atención
                  </label>
                  <Input
                    type="time"
                    name="workingHoursStart"
                    value={settings.workingHoursStart}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Hora de cierre de atención
                  </label>
                  <Input
                    type="time"
                    name="workingHoursEnd"
                    value={settings.workingHoursEnd}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB: CLÍNICA */}
        {activeTab === 'clinic' && (
          <Card>
            <CardHeader>
              <CardTitle>Información de la Clínica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Nombre de la Clínica
                  </label>
                  <Input
                    name="clinicName"
                    value={settings.clinicName}
                    onChange={handleChange}
                    placeholder="Centro de Kinesiología KAREH"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Dirección
                  </label>
                  <Input
                    name="clinicAddress"
                    value={settings.clinicAddress}
                    onChange={handleChange}
                    placeholder="Calle, número, ciudad"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Teléfono
                    </label>
                    <Input
                      name="clinicPhone"
                      value={settings.clinicPhone}
                      onChange={handleChange}
                      placeholder="+54 11 2345-6789"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="clinicEmail"
                      value={settings.clinicEmail}
                      onChange={handleChange}
                      placeholder="info@kareh.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Sitio Web
                  </label>
                  <Input
                    name="clinicWebsite"
                    value={settings.clinicWebsite}
                    onChange={handleChange}
                    placeholder="https://www.kareh.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB: PROFESIONALES */}
        {activeTab === 'professionals' && (
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Profesionales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Especialización por defecto
                </label>
                <Input
                  name="defaultSpecialization"
                  value={settings.defaultSpecialization}
                  onChange={handleChange}
                  placeholder="Kinesiología"
                />
                <p className="text-xs text-slate-500 mt-1">Especialización que se asignará por defecto a nuevos profesionales</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Sesiones por paquete
                </label>
                <Input
                  type="number"
                  name="packageSessionCount"
                  value={settings.packageSessionCount}
                  onChange={handleChange}
                  min="1"
                />
                <p className="text-xs text-slate-500 mt-1">Número de sesiones incluidas en un paquete</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB: NOTIFICACIONES */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="enableEmailNotifications"
                    checked={settings.enableEmailNotifications}
                    onChange={handleChange}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-slate-900">Notificaciones por Email</p>
                    <p className="text-sm text-slate-600">Envía recordatorios de turnos por email</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="enableSMSNotifications"
                    checked={settings.enableSMSNotifications}
                    onChange={handleChange}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-slate-900">Notificaciones por SMS</p>
                    <p className="text-sm text-slate-600">Envía recordatorios de turnos por SMS</p>
                  </div>
                </label>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Recordatorio de cita (horas antes)
                  </label>
                  <Input
                    type="number"
                    name="appointmentReminderMinutes"
                    value={settings.appointmentReminderMinutes}
                    onChange={handleChange}
                    min="1"
                    max="72"
                  />
                  <p className="text-xs text-slate-500 mt-1">Cuántas horas antes enviar el recordatorio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
