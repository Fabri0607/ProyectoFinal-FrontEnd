import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function ParametroForm({ parametro, onClose, onSave }) {
  const [formData, setFormData] = useState({
    parametroId: 0,
    codigo: '',
    descripcion: '',
    tipo: 'CATEGORIA_PRODUCTO',
    valor: '',
    activo: true,
  });

  useEffect(() => {
    if (parametro) {
      setFormData({
        parametroId: parametro.parametroId,
        codigo: parametro.codigo || '',
        descripcion: parametro.descripcion || '',
        tipo: parametro.tipo || 'CATEGORIA_PRODUCTO',
        valor: parametro.valor || '',
        activo: parametro.activo ?? true,
      });
    }
  }, [parametro]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.codigo || !formData.descripcion || !formData.tipo) {
      toast.error('Código, descripción y tipo son obligatorios');
      return;
    }

    const request = parametro
      ? api.put('/Parametro', formData)
      : api.post('/Parametro', formData);

    request
      .then(res => {
        onSave(res.data);
        toast.success(parametro ? 'Parámetro actualizado' : 'Parámetro creado');
      })
      .catch(() => toast.error(parametro ? 'Error al actualizar parámetro' : 'Error al crear parámetro'));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {parametro ? 'Editar Parámetro' : 'Nuevo Parámetro'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Código</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="CATEGORIA_PRODUCTO">CATEGORIA_PRODUCTO</option>
              <option value="TIPO_MOVIMIENTO">TIPO_MOVIMIENTO</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Valor (opcional)</label>
            <input
              type="text"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="mr-2"
              />
              Activo
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParametroForm;