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
          <div className="flex justify-center items-center gap-2 text-slate-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
            Cargando pacientes...
          </div>
        </CardContent>
      </Card>
    )
  }

  // Protección: Si patients no es un array o está vacío
  if (!Array.isArray(patients) || patients.length === 0) {
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
          key={patient.id || index} // Usar index como fallback si no hay ID
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
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 border border-teal-100">
                      <span className="font-semibold text-teal-600">
                        {/* SOLUCIÓN AL ERROR: ?. y || 'P' */}
                        {patient?.name?.charAt(0) || patient?.firstName?.charAt(0) || 'P'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {patient?.name || `${patient?.firstName || 'Sin'} ${patient?.lastName || 'Nombre'}`}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {patient?.dob ? `${calculateAge(patient.dob)} años` : 'Edad N/A'} • {{'M': 'Masculino', 'F': 'Femenino', 'O': 'Otro'}[patient?.gender] || 'No especificado'}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {patient?.email && (
                          <a
                            href={`mailto:${patient.email}`}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {patient.email}
                          </a>
                        )}
                        {patient?.phone && (
                          <a
                            href={`tel:${patient.phone}`}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {patient.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle - Medical info */}
                <div className="hidden lg:flex flex-col gap-2 max-w-[200px]">
                  {patient?.medicalHistory && (
                    <p className="text-xs text-slate-400 italic truncate">
                      {patient.medicalHistory}
                    </p>
                  )}
                </div>

                {/* Right side - Status and Actions */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={patient?.status === 'active' ? 'success' : 'default'}
                    className={patient?.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {patient?.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>

                  <div className="flex gap-1 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onView?.(patient)
                      }}
                    >
                      <Eye className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit?.(patient)
                      }}
                    >
                      <Edit2 className="w-4 h-4 text-slate-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-red-50 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete?.(patient.id)
                      }}
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