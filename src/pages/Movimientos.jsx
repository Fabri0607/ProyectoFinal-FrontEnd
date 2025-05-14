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
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Lista de Movimientos
        </h3>
        {movimientos.length === 0 ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            No hay movimientos
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                  <th className="p-4 rounded-tl-lg min-w-[80px]">ID</th>
                  <th className="p-4 min-w-[150px]">Producto</th>
                  <th className="p-4 min-w-[150px]">Tipo Movimiento</th>
                  <th className="p-4 text-right min-w-[100px]">Cantidad</th>
                  <th className="p-4 min-w-[100px]">Fecha</th>
                  <th className="p-4 rounded-tr-lg min-w-[100px]">Notas</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((mov, index) => (
                  <tr
                    key={mov.movimientoId}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-4 text-right text-gray-800">{mov.movimientoId}</td>
                    <td className="p-4 font-medium text-gray-800">
                      {mov.productoNombre || 'N/A'}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {mov.tipoMovimientoNombre || 'N/A'}
                    </td>
                    <td
                      className={`p-4 text-right ${
                        mov.cantidad < 0 ? 'text-red-500' : 'text-gray-800'
                      }`}
                    >
                      {mov.cantidad}
                    </td>
                    <td className="p-4 text-gray-800">
                      {new Date(mov.fechaMovimiento).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-800">{mov.notas || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Movimientos;