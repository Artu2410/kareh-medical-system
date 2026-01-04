import jsPDF from 'jspdf';

export function exportPatientPDF(patient) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Ficha de Paciente', 10, 15);
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 22);
  let y = 32;
  doc.setFontSize(12);
  doc.text(`Nombre: ${patient.firstName || ''} ${patient.lastName || ''}`, 10, y); y += 8;
  doc.text(`DNI: ${patient.dni || ''}`, 10, y); y += 8;
  doc.text(`Fecha de nacimiento: ${patient.dob || ''}`, 10, y); y += 8;
  doc.text(`Teléfono: ${patient.phone || ''}`, 10, y); y += 8;
  doc.text(`Email: ${patient.email || ''}`, 10, y); y += 8;
  doc.text(`Obra social: ${patient.insurance || ''}`, 10, y); y += 8;
  doc.text(`Dirección: ${patient.address || ''}`, 10, y); y += 8;
  doc.text(`Notas: ${patient.notes || ''}`, 10, y); y += 8;
  doc.save(`ficha-paciente-${patient.lastName || ''}.pdf`);
}
