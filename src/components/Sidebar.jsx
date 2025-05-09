import { Link } from 'react-router-dom';
import { FaBars, FaHome, FaBox, FaShoppingCart, FaChartBar, FaCog, FaHistory } from 'react-icons/fa';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-between p-6">
        {isOpen && <h1 className="text-2xl font-bold">Inventario & Ventas</h1>}
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <FaBars size={24} />
        </button>
      </div>
      <nav className={`${isOpen ? 'p-6' : 'p-2'}`}>
        <Link
          to="/"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaHome size={20} />
          {isOpen && <span>Inicio</span>}
        </Link>
        <Link
          to="/productos"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaBox size={20} />
          {isOpen && <span>Productos</span>}
        </Link>
        <Link
          to="/ventas"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaShoppingCart size={20} />
          {isOpen && <span>Ventas</span>}
        </Link>
        <Link
          to="/movimientos"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaHistory size={20} />
          {isOpen && <span>Movimientos</span>}
        </Link>
        <Link
          to="/parametros"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaCog size={20} />
          {isOpen && <span>Parámetros</span>}
        </Link>
        <Link
          to="/reportes"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaChartBar size={20} />
          {isOpen && <span>Reportes</span>}
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;