import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout';
import { PatientsTable, PatientsToolbar, PatientForm } from '@/components/patients';
import { usePatients } from '@/hooks';
import { Modal, Button } from '@/components/ui';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserPlus, X } from 'lucide-react';

export function PatientsPage() {
  const { 
    patients, 
    loading, 
    error, 
    addPatient, 
    updatePatient, 
    deletePatient, 
    refreshPatients,
    searchLocal 
  } = usePatients();

  const [displayPatients, setDisplayPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sincronizar displayPatients cuando patients cambien
  useEffect(() => {
    if (patients) {
      setDisplayPatients(patients);
    }
  }, [patients]);

  // Aplicar búsqueda local
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchLocal(searchQuery);
      setDisplayPatients(results);
    } else {
      setDisplayPatients(patients);
    }
  }, [searchQuery, patients, searchLocal]);

  /**
   * Abrir formulario para NUEVO paciente
   */
  const handleAddPatient = () => {
    console.log('🆕 Abriendo formulario nuevo paciente');
    setEditingPatient(null);
    setShowForm(true);
  };

  /**
   * Abrir formulario para EDITAR paciente
   */
  const handleEditPatient = (patient) => {
    console.log('✏️ Editando paciente:', patient);
    setEditingPatient(patient);
    setShowForm(true);
  };

  /**
   * Eliminar paciente con confirmación
   */
  const handleDeletePatient = async (id) => {
    const patient = patients.find(p => p.id === id);
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${patient?.firstName} ${patient?.lastName}?`
    );

    if (!confirmed) return;

    try {
      await deletePatient(id);
      toast.success('✅ Paciente eliminado exitosamente', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`❌ Error: ${err.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  /**
   * Ver detalles del paciente
   */
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  /**
   * Guardar paciente (crear o actualizar)
   */
  const handleFormSubmit = async (formData) => {
    try {
      if (editingPatient) {
        // ACTUALIZAR
        await updatePatient(editingPatient.id, formData);
        toast.success('✅ Paciente actualizado exitosamente', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        // CREAR NUEVO
        await addPatient(formData);
        toast.success('✅ Paciente registrado exitosamente', {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      // Cerrar modal y resetear
      setShowForm(false);
      setEditingPatient(null);
    } catch (err) {
      toast.error(`❌ Error: ${err.message}`, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  /**
   * Cerrar formulario
   */
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  /**
   * Manejo de búsqueda desde Toolbar
   */
  const handleSearch = (results) => {
    setDisplayPatients(results);
  };

  /**
   * Manejo de filtros desde Toolbar
   */
  const handleFilter = (results) => {
    setDisplayPatients(results);
  };

  // Mostrar error global
  if (error && !loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Pacientes" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold">❌ Error al cargar pacientes</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
          <Button onClick={refreshPatients} className="mt-4">
            🔄 Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notificaciones Toast */}
      <ToastContainer />

      <div className="space-y-8">
        {/* HEADER */}
        <PageHeader
          title="Gestión de Pacientes"
          subtitle={`${displayPatients.length} paciente${displayPatients.length !== 1 ? 's' : ''} registrado${displayPatients.length !== 1 ? 's' : ''}`}
        />

        {/* BOTÓN PRINCIPAL + BÚSQUEDA */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, DNI, email o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
            />
          </div>
          
          <Button
            onClick={handleAddPatient}
            className="bg-gradient-to-r from-teal-600 to-teal-500 hover:shadow-xl hover:shadow-teal-500/30 text-white px-6 py-3 font-semibold gap-2 whitespace-nowrap"
          >
            <UserPlus className="w-5 h-5" />
            Nuevo Paciente
          </Button>
        </div>

        {/* TOOLBAR (Filtros) */}
        <PatientsToolbar
          patients={patients}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />

        {/* TABLA DE PACIENTES */}
        <PatientsTable
          patients={displayPatients}
          loading={loading}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
          onView={handleViewPatient}
        />

        {/* MODAL DEL FORMULARIO */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[95vh] overflow-hidden animate-slideIn">
              <PatientForm
                patient={editingPatient}
                onSubmit={handleFormSubmit}
                loading={loading}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}

        {/* MODAL DE DETALLES */}
        <Modal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedPatient(null);
          }}
          title="📋 Detalles del Paciente"
          size="lg"
        >
          {selectedPatient && (
            <div className="space-y-6 p-2">
              {/* Header con Avatar */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {selectedPatient.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h3>
                  <p className="text-slate-500">DNI: {selectedPatient.dni}</p>
                </div>
              </div>

              {/* Grid de información */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    📧 Email
                  </p>
                  <p className="text-slate-700">{selectedPatient.email || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    📞 Teléfono
                  </p>
                  <p className="text-slate-700">{selectedPatient.phone || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    🎂 Fecha de Nacimiento
                  </p>
                  <p className="text-slate-700">
                    {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString('es-AR') : 'No registrado'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    🚻 Género
                  </p>
                  <p className="text-slate-700">
                    {selectedPatient.gender === 'M' ? 'Masculino' : selectedPatient.gender === 'F' ? 'Femenino' : 'Otro'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    📍 Dirección
                  </p>
                  <p className="text-slate-700">{selectedPatient.address || 'No registrada'}</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <Button
                  onClick={() => {
                    setShowDetails(false);
                    handleEditPatient(selectedPatient);
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  ✏️ Editar Información
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="secondary"
                  className="px-8"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* CSS para animaciones */}
      <style
        dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
          .animate-slideIn { animation: slideIn 0.3s ease-out; }
        ` }}
      />
    </>
  );
}