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

  // Función para cargar productos desde la API
  const fetchProductos = useCallback(() => {
    setIsLoading(true);
    api.get('/Producto')
      .then(res => {
        setProductos(res.data);
      })
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setIsLoading(false));
  }, []);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      api.delete(`/Producto/${id}`)
        .then(() => {
          setProductos(productos.filter(p => p.productoId !== id));
          toast.success('Producto eliminado');
          // Opcional: Recargar la lista para sincronizar con el backend
          fetchProductos();
        })
        .catch(() => toast.error('Error al eliminar producto'));
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
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-4">Cargando productos...</div>
        ) : (
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Código</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Precio Venta</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Stock Mínimo</th>
                <th className="p-2 text-left">Activo</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-2 text-center">No hay productos</td>
                </tr>
              ) : (
                productos.map(producto => (
                  <tr key={producto.productoId}>
                    <td className="p-2">{producto.codigo || '-'}</td>
                    <td className="p-2">{producto.nombre || '-'}</td>
                    <td className="p-2">${producto.precioVenta?.toFixed(2) || '0.00'}</td>
                    <td className="p-2">{producto.stock ?? 0}</td>
                    <td className="p-2">{producto.stockMinimo ?? 0}</td>
                    <td className="p-2">{producto.activo ? 'Sí' : 'No'}</td>
                    <td className="p-2">
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <ProductoForm
          producto={editProducto}
          onClose={() => setShowModal(false)}
          onSave={(newProducto) => {
            // Actualización local inmediata
            setProductos(editProducto
              ? productos.map(p => p.productoId === newProducto.productoId ? newProducto : p)
              : [...productos, newProducto]);
            setShowModal(false);
            // Recargar la lista desde la API para sincronizar
            fetchProductos();
          }}
        />
      )}
    </div>
  );
}

export default Productos;