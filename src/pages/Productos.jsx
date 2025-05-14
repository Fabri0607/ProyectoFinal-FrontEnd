import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ProductoForm from '../components/ProductoForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProducto, setEditProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductos = useCallback(() => {
    setIsLoading(true);
    api.get('/Producto')
      .then(res => {
        setProductos(res.data);
      })
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      api.delete(`/Producto/${id}`)
        .then(() => {
          setProductos(productos.filter(p => p.productoId !== id));
          toast.success('Producto eliminado');
          fetchProductos();
        })
        .catch(err => {
          console.log('Error en eliminación:', err.response);
          let errorMessage = 'Error al eliminar producto';
          if (err.response?.data) {
            errorMessage =
              typeof err.response.data === 'string'
                ? err.response.data
                : err.response.data.message || errorMessage;
          }
          toast.error(errorMessage);
        });
    }
  };

  return (
    <div className="ml-64 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Productos</h2>
        <button
          onClick={() => {
            setEditProducto(null);
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Nuevo Producto
        </button>
      </div>
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Lista de Productos
        </h3>
        {isLoading ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            Cargando productos...
          </p>
        ) : productos.length === 0 ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            No hay productos
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                  <th className="p-4 rounded-tl-lg min-w-[100px]">Código</th>
                  <th className="p-4 min-w-[150px]">Nombre</th>
                  <th className="p-4 text-right min-w-[120px]">Precio Venta</th>
                  <th className="p-4 text-right min-w-[120px]">Stock</th>
                  <th className="p-4 text-right min-w-[120px]">Stock Mínimo</th>
                  <th className="p-4 min-w-[100px]">Activo</th>
                  <th className="p-4 rounded-tr-lg min-w-[120px]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr
                    key={producto.productoId}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {producto.codigo || '-'}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {producto.nombre || '-'}
                    </td>
                    <td className="p-4 text-right text-gray-800">
                      ${producto.precioVenta?.toFixed(2) || '0.00'}
                    </td>
                    <td className="p-4 text-right text-gray-800">
                      {producto.stock ?? 0}
                    </td>
                    <td className="p-4 text-right text-gray-800">
                      {producto.stockMinimo ?? 0}
                    </td>
                    <td className="p-4 text-gray-800">
                      {producto.activo ? 'Sí' : 'No'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setEditProducto(producto);
                          setShowModal(true);
                        }}
                        className="text-blue-500 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(producto.productoId)}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <ProductoForm
          producto={editProducto}
          onClose={() => setShowModal(false)}
          onSave={(newProducto) => {
            setProductos(
              editProducto
                ? productos.map(p =>
                    p.productoId === newProducto.productoId ? newProducto : p
                  )
                : [...productos, newProducto]
            );
            setShowModal(false);
            fetchProductos();
          }}
        />
      )}
    </div>
  );
}

export default Productos;