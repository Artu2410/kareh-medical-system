const mockStats = {
  totalPatients: 156,
  totalAppointments: 342,
  appointmentsThisMonth: 28,
  patientsSatisfaction: 94.5,
  appointmentChartData: [
    { month: 'Ene', appointments: 28, completions: 26 },
    { month: 'Feb', appointments: 32, completions: 30 },
    { month: 'Mar', appointments: 25, completions: 23 },
    { month: 'Abr', appointments: 30, completions: 28 },
    { month: 'May', appointments: 35, completions: 33 },
    { month: 'Jun', appointments: 28, completions: 27 },
  ],
  patientDemographics: [
    { category: '18-30 años', value: 32, percentage: 20 },
    { category: '31-50 años', value: 78, percentage: 50 },
    { category: '51-65 años', value: 35, percentage: 22 },
    { category: '65+ años', value: 11, percentage: 7 },
  ],
  appointmentStatus: [
    { status: 'Completadas', count: 320, color: '#16A34A' },
    { status: 'Pendientes', count: 15, color: '#EAB308' },
    { status: 'Canceladas', count: 7, color: '#EF4444' },
  ],
}

export function getStats() {
  return mockStats
}

export function getAppointmentStats() {
  return mockStats.appointmentChartData
}

export function getPatientDemographics() {
  return mockStats.patientDemographics
}

export function getAppointmentStatusStats() {
  return mockStats.appointmentStatus
}

export function getTrendData(metric, days = 30) {
  const data = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 50) + 10,
    })
  }
  return data
}
