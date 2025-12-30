const mockAppointments = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Carlos Méndez',
    doctorId: 1,
    doctorName: 'Dr. Juan Pérez',
    date: '2025-12-30',
    time: '09:00',
    duration: 30,
    status: 'confirmed',
    reason: 'Control de presión arterial',
    notes: 'Paciente bien controlado',
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'María García',
    doctorId: 1,
    doctorName: 'Dr. Juan Pérez',
    date: '2025-12-30',
    time: '09:30',
    duration: 30,
    status: 'confirmed',
    reason: 'Revisión de estudios',
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'Roberto Silva',
    doctorId: 2,
    doctorName: 'Dra. Laura Rodríguez',
    date: '2025-12-30',
    time: '14:00',
    duration: 30,
    status: 'pending',
    reason: 'Consulta inicial',
  },
]

export function getAppointments() {
  return mockAppointments
}

export function getAppointmentsByDate(date) {
  return mockAppointments.filter(apt => apt.date === date)
}

export function getAppointmentsByDoctor(doctorId, date) {
  return mockAppointments.filter(
    apt => apt.doctorId === doctorId && apt.date === date
  )
}

export function addAppointment(appointment) {
  const newAppointment = {
    ...appointment,
    id: mockAppointments.length + 1,
    status: 'pending',
  }
  mockAppointments.push(newAppointment)
  return newAppointment
}

export function updateAppointment(id, updates) {
  const index = mockAppointments.findIndex(apt => apt.id === id)
  if (index !== -1) {
    mockAppointments[index] = { ...mockAppointments[index], ...updates }
    return mockAppointments[index]
  }
  return null
}

export function deleteAppointment(id) {
  const index = mockAppointments.findIndex(apt => apt.id === id)
  if (index !== -1) {
    mockAppointments.splice(index, 1)
    return true
  }
  return false
}

export function getAppointmentSlots(doctorId, date) {
  const times = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00',
  ]

  const appointments = getAppointmentsByDoctor(doctorId, date)
  const bookedTimes = appointments.map(apt => apt.time)

  return times
    .map(time => ({
      time,
      available: !bookedTimes.includes(time),
      count: appointments.filter(apt => apt.time === time).length,
    }))
    .filter(slot => slot.count < 5)
}
