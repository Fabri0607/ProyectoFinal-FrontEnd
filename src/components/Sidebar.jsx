import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaChartBar, FaCog, FaHistory } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-gray-100 h-screen p-8 fixed shadow-lg border-r border-gray-700">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Inventario & Ventas</h1>
      <nav className="space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <FaHome className="w-5 h-5" /> Inicio
        </Link>
        <Link
          to="/productos"
          className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <FaBox className="w-5 h-5" /> Productos
        </Link>
        <Link
          to="/ventas"
          className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <FaShoppingCart className="w-5 h-5" /> Ventas
        </Link>
        <Link
          to="/movimientos"
          className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <FaHistory className="w-5 h-5" /> Movimientos
        </Link>
        <Link
          to="/parametros"
          className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <FaCog className="w-5 h-5" /> Parámetros
        </Link>
        <Link
          to="/reportes"
          className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg transition-colors text-gray-200 hover:text-white"
        >
          <FaChartBar className="w-5 h-5" /> Reportes
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;