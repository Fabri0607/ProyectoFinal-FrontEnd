import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ProductoForm from '../components/ProductoForm';
import { FaPlus, FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import { formatCurrency } from '../utils/formatCurrency';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProducto, setEditProducto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc', 'none'
  const itemsPerPage = 10;

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
          setProductos(productos.filter(p => (p.productoId || p.ProductoId) !== id));
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

  const handleSort = () => {
    if (sortOrder === 'none') {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('none');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortedProductos = () => {
    if (sortOrder === 'none') {
      return productos;
    }
    
    return [...productos].sort((a, b) => {
      const codigoA = (a.codigo || a.Codigo || '').toString().toLowerCase();
      const codigoB = (b.codigo || b.Codigo || '').toString().toLowerCase();
      
      if (sortOrder === 'asc') {
        return codigoA.localeCompare(codigoB);
      } else {
        return codigoB.localeCompare(codigoA);
      }
    });
  };

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'asc':
        return <FaSortUp className="inline ml-1" />;
      case 'desc':
        return <FaSortDown className="inline ml-1" />;
      default:
        return <FaSort className="inline ml-1" />;
    }
  };

  const sortedProductos = getSortedProductos();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductos = sortedProductos.slice(indexOfFirstItem, indexOfLastItem);

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
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                    <th className="p-4 rounded-tl-lg min-w-[100px]">
                      <button
                        onClick={handleSort}
                        className="flex items-center hover:text-blue-600 transition-colors"
                        title="Ordenar por código"
                      >
                        Código
                        {getSortIcon()}
                      </button>
                    </th>
                    <th className="p-4 min-w-[150px]">Nombre</th>
                    <th className="p-4 text-right min-w-[120px]">Precio Venta</th>
                    <th className="p-4 text-right min-w-[120px]">Stock</th>
                    <th className="p-4 text-right min-w-[120px]">Stock Mínimo</th>
                    <th className="p-4 min-w-[100px]">Activo</th>
                    <th className="p-4 rounded-tr-lg min-w-[120px]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProductos.map((producto, index) => (
                    <tr
                      key={producto.productoId || producto.ProductoId}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {producto.codigo || producto.Codigo || '-'}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {producto.nombre || producto.Nombre || '-'}
                      </td>
                      <td className="p-4 text-right text-gray-800">
                        {formatCurrency(producto.precioVenta || producto.PrecioVenta || 0)}
                      </td>
                      <td className="p-4 text-right text-gray-800">
                        {producto.stock ?? 0}
                      </td>
                      <td className="p-4 text-right text-gray-800">
                        {producto.stockMinimo ?? 0}
                      </td>
                      <td className="p-4 text-gray-800">
                        {(producto.activo || producto.Activo) ? 'Sí' : 'No'}
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
                          onClick={() => handleDelete(producto.productoId || producto.ProductoId)}
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
            <Pagination
              currentPage={currentPage}
              totalItems={sortedProductos.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
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
                    (p.productoId || p.ProductoId) === (newProducto.productoId || newProducto.ProductoId) ? newProducto : p
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