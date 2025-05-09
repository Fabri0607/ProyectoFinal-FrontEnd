import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import VentaForm from '../components/VentaForm';
import { FaPlus } from 'react-icons/fa';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/Venta')
      .then(res => setVentas(res.data))
      .catch(() => toast.error('Error al cargar ventas'));
  }, []);

  return (
    <div className="ml-64 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Ventas</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Nueva Venta
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Número Factura</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Método Pago</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Estado</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.ventaId}>
                <td className="p-2">{venta.ventaId}</td>
                <td className="p-2">{venta.numeroFactura}</td>
                <td className="p-2">{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                <td className="p-2">{venta.metodoPago}</td>
                <td className="p-2">${venta.total.toFixed(2)}</td>
                <td className="p-2">{venta.estadoVenta}</td>
                <td className="p-2">
                  <Link to={`/ventas/${venta.ventaId}`} className="text-blue-500">
                    Ver Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <VentaForm
          onClose={() => setShowModal(false)}
          onSave={(newVenta) => {
            setVentas([...ventas, newVenta]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Ventas;