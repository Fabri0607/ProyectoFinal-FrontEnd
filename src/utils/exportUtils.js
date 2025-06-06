import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../utils/formatCurrency';

const exportarReporte = (tipo, productos, sortedProductos, reporteInfo = {}) => {
  try {
    const dataToExport = sortedProductos || productos;

    if (!dataToExport || dataToExport.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    switch (tipo.toLowerCase()) {
      case 'excel':
        exportarExcel(dataToExport, reporteInfo);
        break;
      case 'csv':
        exportarCSV(dataToExport, reporteInfo);
        break;
      case 'pdf':
        exportarPDF(dataToExport, reporteInfo);
        break;
      case 'json':
        exportarJSON(dataToExport, reporteInfo);
        break;
      default:
        throw new Error('Formato no soportado');
    }

    return `Reporte exportado en formato ${tipo.toUpperCase()}`;
  } catch (error) {
    console.error('Error al exportar:', error);
    throw error;
  }
};

const formatFileNameDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
};

const generateReportMetadata = (reporteInfo) => {
  const defaultMetadata = {
    titulo: 'Reporte de Productos',
    subtitulo: '',
    periodo: '',
    generadoPor: 'Sistema de Gestión',
    notas: '',
    tipoReporte: 'general'
  };
  return { ...defaultMetadata, ...reporteInfo };
};

const obtenerPrecio = (producto) => Number(producto.precioVenta ?? producto.PrecioVenta ?? 0);

const exportarExcel = (productos, reporteInfo) => {
  const metadata = generateReportMetadata(reporteInfo);
  const datosExcel = productos.map((producto, index) => ({
    '#': index + 1,
    'Código': producto.codigo || producto.Codigo || 'N/A',
    'Nombre': producto.nombre || producto.Nombre || 'Sin nombre',
    'Precio Venta': obtenerPrecio(producto),
    'Stock': producto.stock ?? producto.stockActual ?? 0,
    'Stock Mínimo': producto.stockMinimo ?? 0,
    'Diferencia': (producto.stock ?? producto.stockActual ?? 0) - (producto.stockMinimo ?? 0),
    'Estado': (producto.stock ?? producto.stockActual ?? 0) <= (producto.stockMinimo ?? 0) ? 'BAJO' : 'OK',
    'Activo': (producto.activo || producto.Activo) ? 'Sí' : 'No',
    'ID': producto.productoId || producto.ProductoId || `ID-${index}`
  }));

  const ws = XLSX.utils.json_to_sheet(datosExcel);
  const wb = XLSX.utils.book_new();

  XLSX.utils.sheet_add_aoa(ws, [[metadata.titulo]], { origin: 'A1' });
  XLSX.utils.sheet_add_aoa(ws, [[metadata.subtitulo]], { origin: 'A2' });
  XLSX.utils.sheet_add_aoa(ws, [[`Período: ${metadata.periodo}`]], { origin: 'A3' });
  XLSX.utils.sheet_add_aoa(ws, [[`Generado por: ${metadata.generadoPor}`]], { origin: 'A4' });
  XLSX.utils.sheet_add_aoa(ws, [[`Fecha generación: ${new Date().toLocaleString()}`]], { origin: 'A5' });
  XLSX.utils.sheet_add_aoa(ws, [[`Total registros: ${productos.length}`]], { origin: 'A6' });
  XLSX.utils.sheet_add_aoa(ws, [['']], { origin: 'A7' });

  ws['!cols'] = [
    { wch: 5 }, { wch: 12 }, { wch: 30 }, { wch: 15 },
    { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 10 },
    { wch: 8 }, { wch: 10 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, metadata.tipoReporte === 'ventas' ? 'Ventas' : 'Inventario');
  const fileName = `${metadata.titulo.replace(/ /g, '_')}_${formatFileNameDate()}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

const exportarCSV = (productos, reporteInfo) => {
  const metadata = generateReportMetadata(reporteInfo);
  const headers = ['#', 'Código', 'Nombre', 'Precio Venta', 'Stock', 'Stock Mínimo', 'Diferencia', 'Estado', 'Activo', 'ID'];

  const csvRows = productos.map((producto, index) => [
    index + 1,
    `"${producto.codigo || producto.Codigo || 'N/A'}"`,
    `"${producto.nombre || producto.Nombre || 'Sin nombre'}"`,
    obtenerPrecio(producto),
    producto.stock ?? producto.stockActual ?? 0,
    producto.stockMinimo ?? 0,
    (producto.stock ?? producto.stockActual ?? 0) - (producto.stockMinimo ?? 0),
    (producto.stock ?? producto.stockActual ?? 0) <= (producto.stockMinimo ?? 0) ? 'BAJO' : 'OK',
    (producto.activo || producto.Activo) ? 'Sí' : 'No',
    producto.productoId || producto.ProductoId || `ID-${index}`
  ]);

  const metadataComments = [
    `# ${metadata.titulo}`,
    `# ${metadata.subtitulo}`,
    `# Período: ${metadata.periodo}`,
    `# Generado por: ${metadata.generadoPor}`,
    `# Fecha generación: ${new Date().toLocaleString()}`,
    `# Total registros: ${productos.length}`,
    ''
  ];

  const csvContent = [
    ...metadataComments,
    headers.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${metadata.titulo.replace(/ /g, '_')}_${formatFileNameDate()}.csv`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportarPDF = (productos, reporteInfo) => {
  const metadata = generateReportMetadata(reporteInfo);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const tableStartY = 45;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(metadata.titulo, pageWidth / 2, 20, { align: 'center' });

  if (metadata.subtitulo) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(metadata.subtitulo, pageWidth / 2, 27, { align: 'center' });
  }

  doc.setFontSize(10);
  doc.text(`Generado por: ${metadata.generadoPor}`, margin, 35);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, pageWidth - margin, 35, { align: 'right' });
  if (metadata.periodo) {
    doc.text(`Período: ${metadata.periodo}`, margin, 40);
  }
  doc.text(`Total registros: ${productos.length}`, pageWidth - margin, 40, { align: 'right' });

  const tableData = productos.map((producto, index) => [
    index + 1,
    producto.codigo || producto.Codigo || 'N/A',
    producto.nombre || producto.Nombre || 'Sin nombre',
    formatCurrency(obtenerPrecio(producto)),
    (producto.stock ?? producto.stockActual ?? 0).toString(),
    (producto.stockMinimo ?? 0).toString(),
    ((producto.stock ?? producto.stockActual ?? 0) - (producto.stockMinimo ?? 0)).toString(),
    (producto.activo || producto.Activo) ? 'Sí' : 'No'
  ]);

  const didDrawCell = (data) => {
    if (data.column.index === 4 || data.column.index === 5) {
      const stock = parseInt(data.cell.raw);
      const minStock = parseInt(tableData[data.row.index][5]);
      if (stock <= minStock) {
        data.doc.setTextColor(255, 0, 0);
        data.doc.setFont('helvetica', 'bold');
      }
    }

    if (data.column.index === 6) {
      const diff = parseInt(data.cell.raw);
      if (diff < 0) {
        data.doc.setTextColor(255, 0, 0);
        data.doc.setFont('helvetica', 'bold');
      }
    }
  };

  doc.autoTable({
    head: [['#', 'Código', 'Nombre', 'Precio', 'Stock', 'Stock Mín.', 'Diferencia', 'Activo']],
    body: tableData,
    startY: tableStartY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 20 },
      2: { cellWidth: 40 },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 20, halign: 'center' },
      7: { cellWidth: 15, halign: 'center' }
    },
    didDrawCell,
    styles: { overflow: 'linebreak', cellPadding: 2 }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 5, { align: 'right' });
    if (metadata.notas) {
      doc.text(`Notas: ${metadata.notas}`, margin, doc.internal.pageSize.getHeight() - 5, { align: 'left' });
    }
  }

  doc.save(`${metadata.titulo.replace(/ /g, '_')}_${formatFileNameDate()}.pdf`);
};

const exportarJSON = (productos, reporteInfo) => {
  const metadata = generateReportMetadata(reporteInfo);
  const datosJSON = {
    metadata: {
      ...metadata,
      fechaExportacion: new Date().toISOString(),
      version: '1.0'
    },
    data: {
      totalRegistros: productos.length,
      productos: productos.map(producto => ({
        id: producto.productoId || producto.ProductoId,
        codigo: producto.codigo || producto.Codigo || '',
        nombre: producto.nombre || producto.Nombre || '',
        precioVenta: obtenerPrecio(producto),
        stock: producto.stock ?? producto.stockActual ?? 0,
        stockMinimo: producto.stockMinimo ?? 0,
        diferencia: (producto.stock ?? producto.stockActual ?? 0) - (producto.stockMinimo ?? 0),
        estadoStock: (producto.stock ?? producto.stockActual ?? 0) <= (producto.stockMinimo ?? 0) ? 'BAJO' : 'OK',
        activo: producto.activo || producto.Activo || false,
        categoria: producto.categoriaNombre || ''
      }))
    }
  };

  const blob = new Blob([JSON.stringify(datosJSON, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${metadata.titulo.replace(/ /g, '_')}_${formatFileNameDate()}.json`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { exportarReporte };
