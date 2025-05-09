import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaChartBar, FaCog, FaHistory } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6 fixed">
      <h1 className="text-2xl font-bold mb-8">Inventario & Ventas</h1>
      <nav>
        <Link to="/" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaHome /> Inicio
        </Link>
        <Link to="/productos" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaBox /> Productos
        </Link>
        <Link to="/ventas" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaShoppingCart /> Ventas
        </Link>
        <Link to="/movimientos" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaHistory /> Movimientos
        </Link>
        <Link to="/parametros" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaCog /> Parámetros
        </Link>
        <Link to="/reportes" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaChartBar /> Reportes
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;