import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Parametros() {
  const [parametros, setParametros] = useState([]);

  useEffect(() => {
    api.get('/Parametro')
      .then(res => setParametros(res.data))
      .catch(err => toast.error('Error al cargar parámetros'));
  }, []);

  return (
    <div className="ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6">Parámetros</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Valor</th>
            </tr>
          </thead>
          <tbody>
            {parametros.map(param => (
              <tr key={param.parametroId}>
                <td className="p-2">{param.parametroId}</td>
                <td className="p-2">{param.nombre}</td>
                <td className="p-2">{param.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Parametros;