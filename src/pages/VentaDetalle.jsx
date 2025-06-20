import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import { formatCurrency } from '../utils/formatCurrency';

function VentaDetalle() {
  const { id } = useParams();
  const [detalles, setDetalles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.get(`/DetalleVenta/venta/${id}`)
      .then(res => setDetalles(res.data))
      .catch(() => toast.error('Error al cargar detalles de venta'));
  }, [id]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDetalles = detalles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="ml-64 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Detalles de Venta #{id}</h2>
        <Link
          to="/ventas"
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaArrowLeft /> Volver a Ventas
        </Link>
      </div>
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Detalles de la Venta
        </h3>
        {detalles.length === 0 ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            No hay detalles
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                    <th className="p-4 rounded-tl-lg min-w-[150px]">Producto</th>
                    <th className="p-4 text-right min-w-[120px]">Cantidad</th>
                    <th className="p-4 text-right min-w-[120px]">Precio Unitario</th>
                    <th className="p-4 text-right min-w-[120px]">Descuento</th>
                    <th className="p-4 text-right rounded-tr-lg min-w-[120px]">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDetalles.map((detalle, index) => (
                    <tr
                      key={detalle.detalleVentaId || detalle.DetalleVentaId}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {(detalle.producto?.nombre || detalle.producto?.Nombre) || 'N/A'}
                      </td>
                      <td className="p-4 text-right text-gray-800">
                        {detalle.cantidad || detalle.Cantidad || '-'}
                      </td>
                      <td className="p-4 text-right text-gray-800">
                        {formatCurrency(detalle.precioUnitario || detalle.PrecioUnitario || 0)}
                      </td>
                      <td className="p-4 text-right text-gray-800">
                        {formatCurrency(detalle.descuento || detalle.Descuento || 0)}
                      </td>
                      <td className="p-4 text-right text-gray-800">
                        {formatCurrency(detalle.subtotal || detalle.Subtotal || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={detalles.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default VentaDetalle;