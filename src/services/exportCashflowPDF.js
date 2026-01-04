import jsPDF from 'jspdf';

export function exportCashflowPDF(data = [], filters = {}) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Reporte de Movimientos de Caja', 10, 15);
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 22);
  if (filters.startDate || filters.endDate) {
    doc.text(`Rango: ${filters.startDate || '-'} a ${filters.endDate || '-'}`, 10, 28);
  }
  let y = 35;
  doc.setFontSize(11);
  doc.text('Fecha', 10, y);
  doc.text('Tipo', 40, y);
  doc.text('Concepto', 70, y);
  doc.text('Método', 110, y);
  doc.text('Monto', 150, y);
  y += 6;
  data.forEach(item => {
    doc.text(item.date ? String(item.date).slice(0,10) : '', 10, y);
    doc.text(item.type || '', 40, y);
    doc.text(item.concept || '', 70, y);
    doc.text(item.method || '', 110, y);
    doc.text(String(item.amount || ''), 150, y);
    y += 6;
    if (y > 270) { doc.addPage(); y = 15; }
  });
  doc.save('reporte-caja.pdf');
}
