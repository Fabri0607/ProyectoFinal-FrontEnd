import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    api.get('/MovimientoInventario')
      .then(res => setMovimientos(res.data))
      .catch(() => toast.error('Error al cargar movimientos'));
  }, []);

  return (
    <div className="ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6">Movimientos de Inventario</h2>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left">Tipo Movimiento</th>
              <th className="p-2 text-left">Cantidad</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Notas</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(mov => (
              <tr key={mov.movimientoId}>
                <td className="p-2">{mov.movimientoId}</td>
                <td className="p-2">{mov.productoNombre || 'N/A'}</td>
                <td className="p-2">{mov.tipoMovimientoNombre || 'N/A'}</td>
                <td className="p-2">{mov.cantidad}</td>
                <td className="p-2">{new Date(mov.fechaMovimiento).toLocaleDateString()}</td>
                <td className="p-2">{mov.notas || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movimientos;