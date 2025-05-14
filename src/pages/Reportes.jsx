import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaChartBar } from 'react-icons/fa';

function Reportes() {
  const [reporteVentas, setReporteVentas] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchReporte = () => {
    if (!fechaInicio || !fechaFin) {
      toast.error('Seleccione ambas fechas');
      return;
    }
    api
      .get(`/Reporte/Ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
      .then(res => setReporteVentas(res.data))
      .catch(() => toast.error('Error al cargar reporte de ventas'));
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Reportes</h2>
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Reporte de Ventas
        </h3>
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
            />
          </div>
          <button
            onClick={fetchReporte}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 flex items-center gap-2 self-end"
          >
            <FaChartBar /> Generar Reporte
          </button>
        </div>
        {reporteVentas && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Resumen</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-500">Total Ventas</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {reporteVentas.totalVentas}
                </h3>
              </div>
              <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-500">Monto Total</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  ${reporteVentas.montoTotalVentas.toFixed(2)}
                </h3>
              </div>
              <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-500">Utilidad Total</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  ${reporteVentas.utilidadTotal.toFixed(2)}
                </h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500 mb-6 overflow-x-auto">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Productos Más Vendidos
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reporteVentas.productosMasVendidos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="nombre" stroke="#4b5563" />
                  <YAxis stroke="#4b5563" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#4b5563' }} />
                  <Bar dataKey="cantidadVendida" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;