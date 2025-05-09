import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function Ventas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    api.get('/Venta')
      .then(res => setVentas(res.data))
      .catch(err => toast.error('Error al cargar ventas'));
  }, []);

  return (
    <div className="ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6">Ventas</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.ventaId}>
                <td className="p-2">{venta.ventaId}</td>
                <td className="p-2">{new Date(venta.fecha).toLocaleDateString()}</td>
                <td className="p-2">${venta.total}</td>
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
    </div>
  );
}

export default Ventas;