import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaChartBar, FaCog, FaHistory, FaSignOutAlt, FaUsers } from 'react-icons/fa';

function Sidebar({ onLogout }) {
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');
  const isAdmin = roles.includes('Admin');
  const isColaborador = roles.includes('Colaborador');
  const isVendedor = roles.includes('Vendedor');

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      onLogout();
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-gray-100 h-screen p-8 fixed shadow-lg border-r border-gray-700 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Inventario & Ventas</h1>
      <nav className="space-y-1 flex-grow">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <FaHome className="w-5 h-5" /> Inicio
        </Link>
        {(isAdmin || isColaborador) && (
          <Link
            to="/productos"
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
          >
            <FaBox className="w-5 h-5" /> Productos
          </Link>
        )}
        {(isAdmin || isColaborador || isVendedor) && (
          <Link
            to="/ventas"
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
          >
            <FaShoppingCart className="w-5 h-5" /> Ventas
          </Link>
        )}
        {(isAdmin || isColaborador || isVendedor) && (
          <Link
            to="/movimientos"
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
          >
            <FaHistory className="w-5 h-5" /> Movimientos
          </Link>
        )}
        {(isAdmin || isColaborador) && (
          <Link
            to="/parametros"
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
          >
            <FaCog className="w-5 h-5" /> Parámetros
          </Link>
        )}
        {(isAdmin || isColaborador || isVendedor) && (
          <Link
            to="/reportes"
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
          >
            <FaChartBar className="w-5 h-5" /> Reportes
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/usuarios"
            className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
          >
            <FaUsers className="w-5 h-5" /> Usuarios
          </Link>
        )}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full hover:bg-red-900 rounded-lg transition-colors text-red-400 hover:text-red-300"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;