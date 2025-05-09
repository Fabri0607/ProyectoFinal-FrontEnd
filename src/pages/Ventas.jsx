import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import VentaForm from '../components/VentaForm';
import { FaPlus } from 'react-icons/fa';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar ventas desde la API
  const fetchVentas = useCallback(() => {
    setIsLoading(true);
    api.get('/Venta')
      .then(res => {
        // Ordenar ventas por numeroFactura (descendente)
        const sortedVentas = res.data.sort((a, b) => {
          return b.numeroFactura.localeCompare(a.numeroFactura);
        });
        setVentas(sortedVentas);
      })
      .catch(() => toast.error('Error al cargar ventas'))
      .finally(() => setIsLoading(false));
  }, []);

  // Cargar ventas al montar el componente
  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

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
        {isLoading ? (
          <div className="text-center py-4">Cargando ventas...</div>
        ) : (
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Número Factura</th>
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Método Pago</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-2 text-center">No hay ventas</td>
                </tr>
              ) : (
                ventas.map(venta => (
                  <tr key={venta.ventaId}>
                    <td className="p-2">{venta.numeroFactura || '-'}</td>
                    <td className="p-2">{venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString() : '-'}</td>
                    <td className="p-2">{venta.metodoPago || '-'}</td>
                    <td className="p-2">${venta.total?.toFixed(2) || '0.00'}</td>
                    <td className="p-2">{venta.estadoVenta || '-'}</td>
                    <td className="p-2">
                      <Link to={`/ventas/${venta.ventaId}`} className="text-blue-500">
                        Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <VentaForm
          onClose={() => setShowModal(false)}
          onSave={(newVenta) => {
            // Actualización local inmediata
            setVentas([newVenta, ...ventas]);
            setShowModal(false);
            // Recargar la lista desde la API para sincronizar y ordenar
            fetchVentas();
          }}
        />
      )}
    </div>
  );
}

export default Ventas;