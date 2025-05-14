import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

function VentaForm({ onClose, onSave }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api
      .get('/Producto')
      .then(res => setProductos(res.data))
      .catch(() => toast.error('Error al cargar productos'));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Nueva Venta</h3>
        <Formik
          initialValues={{
            notas: '',
            metodoPago: 'Efectivo',
            detalleVenta: [{ productoId: '', cantidad: 1, descuento: 0 }],
          }}
          validationSchema={Yup.object({
            metodoPago: Yup.string().required('Requerido'),
            detalleVenta: Yup.array()
              .of(
                Yup.object({
                  productoId: Yup.number().min(1, 'Seleccione un producto').required('Requerido'),
                  cantidad: Yup.number().min(1, 'Debe ser mayor a 0').required('Requerido'),
                  descuento: Yup.number().min(0, 'No puede ser negativo').required('Requerido'),
                })
              )
              .min(1, 'Debe agregar al menos un producto'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            api
              .post('/Venta', values)
              .then(res => {
                toast.success('Venta creada');
                onSave(res.data);
              })
              .catch(() => { /* Error manejado por interceptor */ })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <Field
                  name="notas"
                  as="textarea"
                  className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
                />
                <ErrorMessage name="notas" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <Field
                  as="select"
                  name="metodoPago"
                  className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </Field>
                <ErrorMessage name="metodoPago" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Detalles de Venta</h4>
                <FieldArray name="detalleVenta">
                  {({ push, remove }) => (
                    <div className="space-y-6">
                      {values.detalleVenta.map((_, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-6 mb-6 items-start">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                            <Field
                              as="select"
                              name={`detalleVenta[${index}].productoId`}
                              className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
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
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                            <Field
                              name={`detalleVenta[${index}].cantidad`}
                              type="number"
                              min="1"
                              className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-24 shadow-sm"
                            />
                            <ErrorMessage
                              name={`detalleVenta[${index}].cantidad`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descuento</label>
                            <Field
                              name={`detalleVenta[${index}].descuento`}
                              type="number"
                              step="0.01"
                              min="0"
                              className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-24 shadow-sm"
                            />
                            <ErrorMessage
                              name={`detalleVenta[${index}].descuento`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2 mt-6 sm:mt-0"
                          >
                            <FaTrash className="w-5 h-5" /> Eliminar
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ productoId: '', cantidad: 1, descuento: 0 })}
                        className="text-primary px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                      >
                        <FaPlus className="w-5 h-5" /> Agregar Producto
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 flex items-center gap-2"
                >
                  <FaTimes className="w-5 h-5" /> Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaSave className="w-5 h-5" /> Guardar
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