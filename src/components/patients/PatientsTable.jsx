import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { Mail, Phone, Calendar, Edit2, Trash2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { calculateAge } from '@/lib/utils'

export function PatientsTable({
  patients,
  onEdit,
  onDelete,
  onView,
  loading = false,
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">Cargando pacientes...</div>
        </CardContent>
      </Card>
    )
  }

  if (!patients || patients.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">No hay pacientes registrados</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {patients.map((patient, index) => (
        <motion.div
          key={patient.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card hover className="cursor-pointer" onClick={() => onView?.(patient)}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left side - Patient info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-teal-600">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{patient.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {calculateAge(patient.birthDate)} años • {patient.gender === 'M' ? 'Masculino' : 'Femenino'}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <a
                          href={`mailto:${patient.email}`}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {patient.email}
                        </a>
                        <a
                          href={`tel:${patient.phone}`}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {patient.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle - Medical info */}
                <div className="hidden lg:flex flex-col gap-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tipo de sangre</p>
                    <Badge variant="primary" size="sm">
                      {patient.bloodType}
                    </Badge>
                  </div>
                  {patient.medicalHistory && (
                    <p className="text-xs text-slate-500 italic">
                      {patient.medicalHistory.slice(0, 30)}...
                    </p>
                  )}
                </div>

                {/* Right side - Status and Actions */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={patient.status === 'active' ? 'success' : 'default'}
                    size="sm"
                  >
                    {patient.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>

                  <div className="flex gap-1 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onView?.(patient)
                      }}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.(patient)
                      }}
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete?.(patient.id)
                      }}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
