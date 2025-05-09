import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ProductoForm from '../components/ProductoForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProducto, setEditProducto] = useState(null);

  useEffect(() => {
    api.get('/Producto')
      .then(res => setProductos(res.data))
      .catch(err => toast.error('Error al cargar productos'));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      api.delete(`/Producto/${id}`)
        .then(() => {
          setProductos(productos.filter(p => p.productoId !== id));
          toast.success('Producto eliminado');
        })
        .catch(err => toast.error('Error al eliminar producto'));
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
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Precio</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.productoId}>
                <td className="p-2">{producto.productoId}</td>
                <td className="p-2">{producto.nombre}</td>
                <td className="p-2">${producto.precio}</td>
                <td className="p-2">{producto.stock}</td>
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
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <ProductoForm
          producto={editProducto}
          onClose={() => setShowModal(false)}
          onSave={(newProducto) => {
            setProductos(editProducto
              ? productos.map(p => p.productoId === newProducto.productoId ? newProducto : p)
              : [...productos, newProducto]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Productos;