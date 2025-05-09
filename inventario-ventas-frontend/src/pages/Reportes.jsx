import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';

function Reportes() {
  const [reporteVentas, setReporteVentas] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchReporte = () => {
    if (!fechaInicio || !fechaFin) {
      toast.error('Seleccione ambas fechas');
      return;
    }
    api.get(`/Reporte/Ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
      .then(res => setReporteVentas(res.data))
      .catch(err => toast.error('Error al cargar reporte de ventas'));
  };

  return (
    <div className="ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6">Reportes</h2>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Reporte de Ventas</h3>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={fetchReporte}
            className="bg-primary text-white px-4 py-2 rounded mt-6"
          >
            Generar Reporte
          </button>
        </div>
        {reporteVentas && (
          <BarChart width={600} height={300} data={reporteVentas.productosMasVendidos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidadVendida" fill="#2563eb" />
          </BarChart>
        )}
      </div>
    </div>
  );
}

export default Reportes;