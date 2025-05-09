import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function VentaDetalle() {
  const { id } = useParams();
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    api.get(`/DetalleVenta/venta/${id}`)
      .then(res => setDetalles(res.data))
      .catch(() => toast.error('Error al cargar detalles de venta'));
  }, [id]);

  return (
    <div className="ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6">Detalles de Venta #{id}</h2>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left">Cantidad</th>
              <th className="p-2 text-left">Precio Unitario</th>
              <th className="p-2 text-left">Descuento</th>
              <th className="p-2 text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map(detalle => (
              <tr key={detalle.detalleVentaId}>
                <td className="p-2">{detalle.producto?.nombre || 'N/A'}</td>
                <td className="p-2">{detalle.cantidad}</td>
                <td className="p-2">${detalle.precioUnitario.toFixed(2)}</td>
                <td className="p-2">${detalle.descuento.toFixed(2)}</td>
                <td className="p-2">${detalle.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VentaDetalle;