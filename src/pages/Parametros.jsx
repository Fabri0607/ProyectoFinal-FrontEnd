import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ParametroForm from '../components/ParametroForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

function Parametros() {
  const [parametros, setParametros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editParametro, setEditParametro] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar parámetros desde la API
  const fetchParametros = useCallback(() => {
    setIsLoading(true);
    api.get('/Parametro')
      .then(res => {
        setParametros(res.data);
      })
      .catch(() => toast.error('Error al cargar parámetros'))
      .finally(() => setIsLoading(false));
  }, []);

  // Cargar parámetros al montar el componente
  useEffect(() => {
    fetchParametros();
  }, [fetchParametros]);

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar parámetro?')) {
      api.delete(`/Parametro/${id}`)
        .then(() => {
          setParametros(parametros.filter(p => p.parametroId !== id));
          toast.success('Parámetro eliminado');
          fetchParametros();
        })
        .catch(err => {
          const errorMessage = typeof err.response?.data === 'string'
            ? err.response.data
            : err.response?.data?.message || 'Error al eliminar parámetro';
          toast.error(errorMessage);
        });
    }
  };

  return (
    <div className="ml-64 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Parámetros</h2>
        <button
          onClick={() => {
            setEditParametro(null);
            setShowModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Nuevo Parámetro
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-4">Cargando parámetros...</div>
        ) : (
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Código</th>
                <th className="p-2 text-left">Descripción</th>
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Valor</th>
                <th className="p-2 text-left">Activo</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {parametros.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-2 text-center">No hay parámetros</td>
                </tr>
              ) : (
                parametros.map(parametro => (
                  <tr key={parametro.parametroId}>
                    <td className="p-2">{parametro.codigo || '-'}</td>
                    <td className="p-2">{parametro.descripcion || '-'}</td>
                    <td className="p-2">{parametro.tipo || '-'}</td>
                    <td className="p-2">{parametro.valor || '-'}</td>
                    <td className="p-2">{parametro.activo ? 'Sí' : 'No'}</td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setEditParametro(parametro);
                          setShowModal(true);
                        }}
                        className="text-blue-500 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(parametro.parametroId)}
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
        <ParametroForm
          parametro={editParametro}
          onClose={() => setShowModal(false)}
          onSave={(newParametro) => {
            setParametros(editParametro
              ? parametros.map(p => p.parametroId === newParametro.parametroId ? newParametro : p)
              : [...parametros, newParametro]);
            setShowModal(false);
            fetchParametros();
          }}
        />
      )}
    </div>
  );
}

export default Parametros;