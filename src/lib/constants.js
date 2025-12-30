import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'

export const SIDENAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    id: 'appointments',
    label: 'Agenda',
    icon: Calendar,
    href: '/appointments',
  },
  {
    id: 'patients',
    label: 'Pacientes',
    icon: Users,
    href: '/patients',
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: BarChart3,
    href: '/reports',
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Settings,
    href: '/settings',
  },
]

export const APPOINTMENT_STATUSES = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

export const APPOINTMENT_STATUS_LABELS = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
  completed: 'Completada',
}

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
]

export const MAX_APPOINTMENTS_PER_SLOT = 5
export const APPOINTMENT_DURATION = 30 // minutos

export const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

export const GENDERS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
]

export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
}

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  EXPORT: 'export',
}
