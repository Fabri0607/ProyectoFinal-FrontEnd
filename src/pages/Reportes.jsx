import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaChartBar,
  FaBoxes,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaEye,
  FaSpinner
} from 'react-icons/fa';

function Reportes() {
  const location = useLocation();
  const [reporteVentas, setReporteVentas] = useState(null);
  const [reporteInventario, setReporteInventario] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loadingVentas, setLoadingVentas] = useState(false);
  const [loadingInventario, setLoadingInventario] = useState(false);
  const [activeTab, setActiveTab] = useState('ventas');

  // Colores para gráficos
  const COLORS = ['#2563eb', '#7c3aed', '#dc2626', '#059669', '#d97706', '#db2777'];

  // Leer parámetros de URL y establecer la pestaña activa
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'inventario') {
      setActiveTab('inventario');
    }
  }, [location]);

  // Cargar reporte de inventario al montar el componente
  useEffect(() => {
    fetchReporteInventario();
  }, []);

  const fetchReporteVentas = async () => {
    if (!fechaInicio || !fechaFin) {
      toast.error('Seleccione ambas fechas');
      return;
    }

    setLoadingVentas(true);
    try {
      const response = await api.get(`/Reporte/Ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      setReporteVentas(response.data);
      toast.success('Reporte de ventas generado exitosamente');
    } catch (error) {
      toast.error('Error al cargar reporte de ventas');
      console.error('Error:', error);
    } finally {
      setLoadingVentas(false);
    }
  };

  const fetchReporteInventario = async () => {
    setLoadingInventario(true);
    try {
      const response = await api.get('/Reporte/Inventario');
      setReporteInventario(response.data);
    } catch (error) {
      toast.error('Error al cargar reporte de inventario');
      console.error('Error:', error);
    } finally {
      setLoadingInventario(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CR');
  };

  const prepararDatosInventario = () => {
    if (!reporteInventario || !reporteInventario.productosPorCategoria) return [];

    return reporteInventario.productosPorCategoria.map(categoria => ({
      nombre: categoria.categoriaNombre,
      cantidad: categoria.cantidadProductos,
      valor: categoria.valorizacionTotal
    }));
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Panel de Reportes</h2>
        <p className="text-gray-600">Análisis detallado de ventas e inventario</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('ventas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ventas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaChartBar className="inline mr-2" />
              Reporte de Ventas
            </button>
            <button
              onClick={() => setActiveTab('inventario')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inventario'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBoxes className="inline mr-2" />
              Reporte de Inventario
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido de Reporte de Ventas */}
      {activeTab === 'ventas' && (
        <div className="space-y-6">
          {/* Panel de filtros */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-600" />
              Configurar Reporte de Ventas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={fetchReporteVentas}
                  disabled={loadingVentas}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingVentas ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaChartBar />
                  )}
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>

          {/* Resultados del reporte de ventas */}
          {reporteVentas && (
            <div className="space-y-6">
              {/* Resumen de métricas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Ventas</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {reporteVentas.totalVentas}
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaChartBar className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Monto Total</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {formatCurrency(reporteVentas.montoTotalVentas)}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaChartBar className="text-green-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Utilidad Total</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {formatCurrency(reporteVentas.utilidadTotal)}
                      </h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaChartBar className="text-purple-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Margen Promedio</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {reporteVentas.montoTotalVentas > 0
                          ? ((reporteVentas.utilidadTotal / reporteVentas.montoTotalVentas) * 100).toFixed(1) + '%'
                          : '0%'
                        }
                      </h3>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FaChartBar className="text-orange-600 text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de productos más vendidos */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Productos Más Vendidos
                  </h4>
                  <div className="text-sm text-gray-500">
                    Período: {formatDate(fechaInicio)} - {formatDate(fechaFin)}
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reporteVentas.productosMasVendidos?.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="nombre"
                        stroke="#6b7280"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="cantidadVendida"
                        fill="#2563eb"
                        name="Cantidad Vendida"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenido de Reporte de Inventario */}
      {activeTab === 'inventario' && (
        <div className="space-y-6">
          {/* Panel de control */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaBoxes className="mr-2 text-blue-600" />
                Reporte de Inventario
              </h3>
              <button
                onClick={fetchReporteInventario}
                disabled={loadingInventario}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loadingInventario ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaEye />
                )}
                Actualizar
              </button>
            </div>
          </div>

          {/* Contenido del reporte de inventario */}
          {reporteInventario && (
            <div className="space-y-6">
              {/* Resumen de inventario */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Productos</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {reporteInventario.totalProductos || 0}
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaBoxes className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Valor Total</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {formatCurrency(reporteInventario.valorizacionTotal || 0)}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaChartBar className="text-green-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Stock Bajo</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {reporteInventario.productosStockBajo?.length || 0}
                      </h3>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <FaExclamationTriangle className="text-red-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Categorías</p>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {prepararDatosInventario().length}
                      </h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaBoxes className="text-purple-600 text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos de inventario */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de barras por categoría */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Inventario por Categoría
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepararDatosInventario()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                          dataKey="nombre"
                          stroke="#6b7280"
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Bar
                          dataKey="cantidad"
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfico de pastel de valor por categoría */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Valor por Categoría
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepararDatosInventario()}
                          dataKey="valor"
                          nameKey="nombre"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepararDatosInventario().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Valor']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tabla de productos con stock bajo */}
              {reporteInventario.productosStockBajo && reporteInventario.productosStockBajo.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    Productos con Stock Bajo
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                          <th className="p-4 rounded-tl-lg min-w-[100px]">Código</th>
                          <th className="p-4 min-w-[150px]">Producto</th>
                          <th className="p-4 text-right min-w-[120px]">Stock Actual</th>
                          <th className="p-4 text-right min-w-[120px]">Stock Mínimo</th>
                          <th className="p-4 text-right rounded-tr-lg min-w-[120px]">
                            Diferencia
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reporteInventario.productosStockBajo.map((producto, index) => (
                          <tr
                            key={producto.productoId || index}
                            className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="p-4 font-medium text-gray-800">
                              {producto.codigo || 'N/A'}
                            </td>
                            <td className="p-4 font-medium text-gray-800">
                              {producto.nombre || 'N/A'}
                            </td>
                            <td className="p-4 text-right text-gray-800">
                              {producto.stockActual ?? 0}
                            </td>
                            <td className="p-4 text-right text-gray-800">
                              {producto.stockMinimo ?? 0}
                            </td>
                            <td
                              className={`p-4 text-right ${
                                (producto.stockActual - producto.stockMinimo) < 0
                                  ? 'text-red-500'
                                  : 'text-gray-800'
                              }`}
                            >
                              {(producto.stockActual - producto.stockMinimo) ?? 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reportes;