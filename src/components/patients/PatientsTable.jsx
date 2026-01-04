import { Card, CardContent, Badge, Button, Input } from '@/components/ui'
import { Mail, Phone, Edit2, Trash2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { calculateAge } from '@/lib/utils'

export function PatientsTable({
  patients = [], // Valor por defecto para evitar .map error
  onEdit,
  onDelete,
  onView,
  onInlineEdit, // Nuevo prop para edición in-line
  loading = false,
}) {
  const [editing, setEditing] = React.useState({ id: null, field: null });
  const [draft, setDraft] = React.useState("");
  // 1. Estado de carga
  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500 animate-pulse">Cargando pacientes...</div>
        </CardContent>
      </Card>
    )
  }

  // 2. Validación de datos (Aseguramos que sea Array)
  const safePatients = Array.isArray(patients) ? patients : [];

  // 3. Estado vacío
  if (safePatients.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-slate-500">No hay pacientes registrados o la búsqueda no coincide</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {safePatients.map((patient, index) => (
        <motion.div
          key={patient.id || index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView?.(patient)}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Info del Paciente */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-teal-600">
                        {patient.firstName ? patient.firstName.charAt(0) : 'P'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {calculateAge(patient.dob)} años • {patient.gender === 'M' ? 'Masculino' : 'Femenino'} • DNI: {patient.dni}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {patient.email && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="w-3.5 h-3.5" /> {patient.email}
                          </span>
                        )}
                        {/* Teléfono editable */}
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Phone className="w-3.5 h-3.5" />
                          {editing.id === patient.id && editing.field === 'phone' ? (
                            <Input
                              value={draft}
                              onChange={e => setDraft(e.target.value)}
                              onBlur={() => {
                                setEditing({ id: null, field: null });
                                if (draft !== patient.phone && onInlineEdit) onInlineEdit(patient.id, 'phone', draft);
                              }}
                              autoFocus
                              className="glassmorphism-input w-24"
                            />
                          ) : (
                            <span onDoubleClick={e => {
                              e.stopPropagation();
                              setEditing({ id: patient.id, field: 'phone' });
                              setDraft(patient.phone || '');
                            }}>{patient.phone || <span className="italic text-slate-400">Sin teléfono</span>}</span>
                          )}
                        </span>
                        {/* Obra social editable */}
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <span className="font-bold">Obra Social:</span>
                          {editing.id === patient.id && editing.field === 'insurance' ? (
                            <Input
                              value={draft}
                              onChange={e => setDraft(e.target.value)}
                              onBlur={() => {
                                setEditing({ id: null, field: null });
                                if (draft !== (patient.insurance || '') && onInlineEdit) onInlineEdit(patient.id, 'insurance', draft);
                              }}
                              autoFocus
                              className="glassmorphism-input w-32"
                            />
                          ) : (
                            <span onDoubleClick={e => {
                              e.stopPropagation();
                              setEditing({ id: patient.id, field: 'insurance' });
                              setDraft(patient.insurance || '');
                            }}>{patient.insurance || <span className="italic text-slate-400">Sin obra social</span>}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); onView?.(patient); }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); onEdit?.(patient); }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => { e.stopPropagation(); onDelete?.(patient.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}