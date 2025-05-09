import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Home() {
  const [stockBajo, setStockBajo] = useState([]);

  useEffect(() => {
    api.get('/Reporte/StockBajo')
      .then(res => setStockBajo(res.data))
      .catch(err => toast.error('Error al cargar productos con stock bajo'));
  }, []);

  return (
    <div className="ml-64 p-8">
      <h2 className="text-3xl font-bold mb-6">Bienvenido</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Productos con Stock Bajo</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left">Stock Actual</th>
              <th className="p-2 text-left">Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {stockBajo.map(producto => (
              <tr key={producto.productoId}>
                <td className="p-2">{producto.nombre}</td>
                <td className="p-2">{producto.stockActual}</td>
                <td className="p-2">{producto.stockMinimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;