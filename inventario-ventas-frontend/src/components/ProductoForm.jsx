import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import toast from 'react-hot-toast';

function ProductoForm({ producto, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        <Formik
          initialValues={{
            productoId: producto?.productoId || 0,
            nombre: producto?.nombre || '',
            precio: producto?.precio || 0,
            stock: producto?.stock || 0,
          }}
          validationSchema={Yup.object({
            nombre: Yup.string().required('Requerido'),
            precio: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('Requerido'),
            stock: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('Requerido'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            const method = producto ? 'put' : 'post';
            const url = '/Producto';
            api[method](url, values)
              .then(res => {
                toast.success(producto ? 'Producto actualizado' : 'Producto creado');
                onSave(res.data);
              })
              .catch(err => toast.error('Error al guardar producto'))
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <Field name="nombre" type="text" className="w-full p-2 border rounded" />
                <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Precio</label>
                <Field name="precio" type="number" className="w-full p-2 border rounded" />
                <ErrorMessage name="precio" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Field name="stock" type="number" className="w-full p-2 border rounded" />
                <ErrorMessage name="stock" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Guardar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ProductoForm;