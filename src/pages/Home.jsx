import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaBox, FaShoppingCart } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';

function Home() {
  const [stockBajo, setStockBajo] = useState([]);
  const [ventasHoy, setVentasHoy] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Load roles from localStorage
    const rolesStored = JSON.parse(localStorage.getItem('roles') || '[]');
    console.log('Roles:', rolesStored); // Debug log
    setUserRoles(rolesStored);

    const fetchData = async () => {
      try {
        // Generar fechas en CST
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        // Formato YYYY-MM-DD manual para CST
        const fechaInicio = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const fechaFin = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

        const [stockRes, ventasRes] = await Promise.all([
          api.get('/Reporte/StockBajo'),
          api.get(`/Reporte/Ventas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
        ]);

        setStockBajo(stockRes.data);
        console.log('Ventas Response:', ventasRes.data); // Corrected log
        setVentasHoy(ventasRes.data.totalVentas || 0);
      } catch (error) {
        if (error.response?.config.url.includes('StockBajo')) {
          toast.error('Error al cargar productos con stock bajo');
        } else {
          toast.error('Error al cargar ventas de hoy');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Verificar si el usuario tiene permisos de Admin o Colaborador
  const hasProductosPermission = userRoles.includes('Admin') || userRoles.includes('Colaborador');

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStockBajo = stockBajo.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Bienvenido al panel principal del sistema</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Link to="/reportes?tab=inventario">
              <Card
                icon={<FaExclamationTriangle size={24} />}
                title="Stock Bajo"
                value={stockBajo.length}
                color="yellow"
              />
            </Link>
            {hasProductosPermission && (
              <Link to="/productos">
                <Card
                  icon={<FaBox size={24} />}
                  title="Productos"
                  value="Ver todos"
                  color="blue"
                />
              </Link>
            )}
            <Link to="/ventas">
              <Card
                icon={<FaShoppingCart size={24} />}
                title="Ventas Hoy"
                value={ventasHoy}
                color="green"
              />
            </Link>
          </section>

          <section className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Productos con Stock Bajo
            </h3>
            {stockBajo.length === 0 ? (
              <p className="text-gray-600 text-center py-6 font-medium">
                No hay productos con stock bajo
              </p>
            ) : (
              <>
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
                      {currentStockBajo.map((producto, index) => (
                        <tr
                          key={producto.productoId}
                          className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
                            className={`p-4 text-right ${(producto.stockActual - producto.stockMinimo) < 0
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
                <Pagination
                  currentPage={currentPage}
                  totalItems={stockBajo.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Card({ icon, title, value, color }) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-500',
    blue: 'bg-blue-100 text-blue-700 border-blue-500',
    green: 'bg-green-100 text-green-700 border-green-500',
  };

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow border-l-4 ${colorClasses[color]} hover:shadow-lg transition-shadow cursor-pointer`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default Home;