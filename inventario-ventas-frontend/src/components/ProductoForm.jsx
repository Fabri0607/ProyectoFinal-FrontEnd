import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import toast from 'react-hot-toast';

function ProductoForm({ producto, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">
          {producto ? 'Editar Producto' : 'Nuevo Producto'}
        </h3>
        <Formik
          initialValues={{
            productoId: producto?.productoId || 0,
            nombre: producto?.nombre || '',
            descripcion: producto?.descripcion || '',
            codigo: producto?.codigo || '',
            precioCompra: producto?.precioCompra || 0,
            precioVenta: producto?.precioVenta || 0,
            stock: producto?.stock || 0,
            stockMinimo: producto?.stockMinimo || 0,
            categoriaId: producto?.categoriaId || 1, // Asumimos un valor por defecto
            activo: producto?.activo ?? true,
          }}
          validationSchema={Yup.object({
            nombre: Yup.string().required('Requerido'),
            descripcion: Yup.string().required('Requerido'),
            codigo: Yup.string().required('Requerido'),
            precioCompra: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('Requerido'),
            precioVenta: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('Requerido'),
            stock: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('Requerido'),
            stockMinimo: Yup.number().min(0, 'Debe ser mayor o igual a 0').required('Requerido'),
            categoriaId: Yup.number().min(1, 'Seleccione una categoría').required('Requerido'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            const method = producto ? 'put' : 'post';
            api[method]('/Producto', values)
              .then(res => {
                toast.success(producto ? 'Producto actualizado' : 'Producto creado');
                onSave(res.data);
              })
              .catch(() => { /* Error manejado por interceptor */ })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <Field name="nombre" type="text" className="w-full p-2 border rounded" />
                <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <Field name="descripcion" type="text" className="w-full p-2 border rounded" />
                <ErrorMessage name="descripcion" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Código</label>
                <Field name="codigo" type="text" className="w-full p-2 border rounded" />
                <ErrorMessage name="codigo" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio Compra</label>
                <Field name="precioCompra" type="number" step="0.01" className="w-full p-2 border rounded" />
                <ErrorMessage name="precioCompra" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio Venta</label>
                <Field name="precioVenta" type="number" step="0.01" className="w-full p-2 border rounded" />
                <ErrorMessage name="precioVenta" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Field name="stock" type="number" className="w-full p-2 border rounded" />
                <ErrorMessage name="stock" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Mínimo</label>
                <Field name="stockMinimo" type="number" className="w-full p-2 border rounded" />
                <ErrorMessage name="stockMinimo" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría ID</label>
                <Field name="categoriaId" type="number" className="w-full p-2 border rounded" />
                <ErrorMessage name="categoriaId" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Activo</label>
                <Field name="activo" type="checkbox" className="mt-1" />
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