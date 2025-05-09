import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import toast from 'react-hot-toast';

function VentaForm({ onClose, onSave }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api.get('/Producto')
      .then(res => setProductos(res.data))
      .catch(() => toast.error('Error al cargar productos'));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Nueva Venta</h3>
        <Formik
          initialValues={{
            notas: '',
            metodoPago: 'Efectivo',
            detalleVenta: [{ productoId: '', cantidad: 1, descuento: 0 }],
          }}
          validationSchema={Yup.object({
            metodoPago: Yup.string().required('Requerido'),
            detalleVenta: Yup.array().of(
              Yup.object({
                productoId: Yup.number().min(1, 'Seleccione un producto').required('Requerido'),
                cantidad: Yup.number().min(1, 'Debe ser mayor a 0').required('Requerido'),
                descuento: Yup.number().min(0, 'No puede ser negativo').required('Requerido'),
              })
            ).min(1, 'Debe agregar al menos un producto'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            api.post('/Venta', values)
              .then(res => {
                toast.success('Venta creada');
                onSave(res.data);
              })
              .catch(() => { /* Error manejado por interceptor */ })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <Field name="notas" as="textarea" className="w-full p-2 border rounded" />
                <ErrorMessage name="notas" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Método de Pago</label>
                <Field as="select" name="metodoPago" className="w-full p-2 border rounded">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </Field>
                <ErrorMessage name="metodoPago" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Detalles de Venta</h4>
                <FieldArray name="detalleVenta">
                  {({ push, remove }) => (
                    <div>
                      {values.detalleVenta.map((_, index) => (
                        <div key={index} className="flex gap-4 mb-4 items-center">
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Producto</label>
                            <Field
                              as="select"
                              name={`detalleVenta[${index}].productoId`}
                              className="w-full p-2 border rounded"
                            >
                              <option value="">Seleccione un producto</option>
                              {productos.map(p => (
                                <option key={p.productoId} value={p.productoId}>
                                  {p.nombre} ({p.codigo})
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name={`detalleVenta[${index}].productoId`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Cantidad</label>
                            <Field
                              name={`detalleVenta[${index}].cantidad`}
                              type="number"
                              min="1"
                              className="w-24 p-2 border rounded"
                            />
                            <ErrorMessage
                              name={`detalleVenta[${index}].cantidad`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Descuento</label>
                            <Field
                              name={`detalleVenta[${index}].descuento`}
                              type="number"
                              step="0.01"
                              min="0"
                              className="w-24 p-2 border rounded"
                            />
                            <ErrorMessage
                              name={`detalleVenta[${index}].descuento`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 mt-6"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ productoId: '', cantidad: 1, descuento: 0 })}
                        className="text-primary"
                      >
                        + Agregar Producto
                      </button>
                    </div>
                  )}
                </FieldArray>
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

export default VentaForm;