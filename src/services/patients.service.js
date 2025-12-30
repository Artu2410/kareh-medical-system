const mockPatients = [
  {
    id: 1,
    name: 'Carlos Méndez',
    email: 'carlos@email.com',
    phone: '+34 912 345 678',
    birthDate: '1975-05-15',
    gender: 'M',
    bloodType: 'O+',
    medicalHistory: 'Hipertensión, Diabetes tipo 2',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@email.com',
    phone: '+34 923 456 789',
    birthDate: '1982-08-22',
    gender: 'F',
    bloodType: 'A+',
    medicalHistory: 'Alergia a penicilina',
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: 3,
    name: 'Roberto Silva',
    email: 'roberto@email.com',
    phone: '+34 934 567 890',
    birthDate: '1968-03-10',
    gender: 'M',
    bloodType: 'B+',
    medicalHistory: 'Problemas cardíacos',
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: 4,
    name: 'Ana López',
    email: 'ana@email.com',
    phone: '+34 945 678 901',
    birthDate: '1990-11-05',
    gender: 'F',
    bloodType: 'AB-',
    medicalHistory: '',
    status: 'active',
    createdAt: '2024-04-05',
  },
]

export function getPatients() {
  return mockPatients
}

export function getPatientById(id) {
  return mockPatients.find(p => p.id === id)
}

export function searchPatients(query) {
  const lowercaseQuery = query.toLowerCase()
  return mockPatients.filter(
    p => p.name.toLowerCase().includes(lowercaseQuery) ||
         p.email.toLowerCase().includes(lowercaseQuery) ||
         p.phone.includes(query)
  )
}

export function addPatient(patient) {
  const newPatient = {
    ...patient,
    id: mockPatients.length + 1,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
  }
  mockPatients.push(newPatient)
  return newPatient
}

export function updatePatient(id, updates) {
  const index = mockPatients.findIndex(p => p.id === id)
  if (index !== -1) {
    mockPatients[index] = { ...mockPatients[index], ...updates }
    return mockPatients[index]
  }
  return null
}

export function deletePatient(id) {
  const index = mockPatients.findIndex(p => p.id === id)
  if (index !== -1) {
    mockPatients.splice(index, 1)
    return true
  }
  return false
}

export function getPatientsByStatus(status) {
  return mockPatients.filter(p => p.status === status)
}
