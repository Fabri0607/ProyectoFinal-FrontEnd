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

  const fetchParametros = useCallback(() => {
    setIsLoading(true);
    api.get('/Parametro')
      .then(res => {
        setParametros(res.data);
      })
      .catch(() => toast.error('Error al cargar parámetros'))
      .finally(() => setIsLoading(false));
  }, []);

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
          const errorMessage =
            typeof err.response?.data === 'string'
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
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Lista de Parámetros
        </h3>
        {isLoading ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            Cargando parámetros...
          </p>
        ) : parametros.length === 0 ? (
          <p className="text-gray-600 text-center py-6 font-medium">
            No hay parámetros
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-50 text-gray-800 font-semibold border-b border-gray-200">
                  <th className="p-4 rounded-tl-lg min-w-[100px]">Código</th>
                  <th className="p-4 min-w-[150px]">Descripción</th>
                  <th className="p-4 min-w-[100px]">Tipo</th>
                  <th className="p-4 min-w-[100px]">Valor</th>
                  <th className="p-4 min-w-[100px]">Activo</th>
                  <th className="p-4 rounded-tr-lg min-w-[120px]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {parametros.map((parametro, index) => (
                  <tr
                    key={parametro.parametroId}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {parametro.codigo || '-'}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {parametro.descripcion || '-'}
                    </td>
                    <td className="p-4 text-gray-800">{parametro.tipo || '-'}</td>
                    <td className="p-4 text-gray-800">{parametro.valor || '-'}</td>
                    <td className="p-4 text-gray-800">
                      {parametro.activo ? 'Sí' : 'No'}
                    </td>
                    <td className="p-4">
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showModal && (
        <ParametroForm
          parametro={editParametro}
          onClose={() => setShowModal(false)}
          onSave={(newParametro) => {
            setParametros(
              editParametro
                ? parametros.map(p =>
                    p.parametroId === newParametro.parametroId ? newParametro : p
                  )
                : [...parametros, newParametro]
            );
            setShowModal(false);
            fetchParametros();
          }}
        />
      )}
    </div>
  );
}

export default Parametros;