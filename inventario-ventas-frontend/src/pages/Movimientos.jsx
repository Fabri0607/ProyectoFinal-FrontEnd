import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    api.get('/MovimientoInventario')
      .then(res => setMovimientos(res.data))
      .catch(err => toast.error('Error al cargar movimientos'));
  }, []);

  return (
    <div className="ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6">Movimientos de Inventario</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left">Tipo</th>
              <th className="p-2 text-left">Cantidad</th>
              <th className="p-2 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(mov => (
              <tr key={mov.movimientoId}>
                <td className="p-2">{mov.movimientoId}</td>
                <td className="p-2">{mov.productoNombre}</td>
                <td className="p-2">{mov.tipoMovimiento}</td>
                <td className="p-2">{mov.cantidad}</td>
                <td className="p-2">{new Date(mov.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movimientos;