import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { formatCurrency } from '../utils/formatCurrency'; // Import shared utility

function VentaForm({ onClose, onSave }) {
  const [productos, setProductos] = useState([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(true);

  useEffect(() => {
    setIsLoadingProductos(true);
    api
      .get('/Producto')
      .then(res => {
        const activeProducts = res.data.filter(p => p.activo === true || p.Activo === true);
        setProductos(activeProducts);
      })
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setIsLoadingProductos(false));
  }, []);

  // Calculate subtotal for a single detail with safety checks
  const calculateSubtotal = (detalle, productos) => {
    try {
      if (!detalle.productoId || isNaN(Number(detalle.productoId))) return 0;
      
      const producto = productos.find(p => (p.productoId || p.ProductoId) === Number(detalle.productoId));
      if (!producto) return 0;
      
      const precio = Number(producto.precioVenta || producto.PrecioVenta) || 0;
      const cantidad = Number(detalle.cantidad) || 1;
      const porcentajeDescuento = Number(detalle.descuentoPorcentaje) || 0;
      
      const subtotalBruto = precio * cantidad;
      const montoDescuento = (subtotalBruto * porcentajeDescuento) / 100;
      const subtotal = subtotalBruto - montoDescuento;
      
      return Math.max(0, subtotal);
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return 0;
    }
  };

  // Calculate totals for the sale with safety checks
  const calculateTotals = (detalleVenta, productos) => {
    try {
      if (!Array.isArray(detalleVenta)) {
        return { subtotalSum: 0, impuestos: 0, total: 0 };
      }

      const subtotalSum = detalleVenta.reduce((sum, detalle) => {
        return sum + calculateSubtotal(detalle, productos);
      }, 0);
      
      const impuestos = subtotalSum * 0.16; // 16% tax
      const total = subtotalSum + impuestos;
      
      return { 
        subtotalSum: Number(subtotalSum) || 0, 
        impuestos: Number(impuestos) || 0, 
        total: Number(total) || 0 
      };
    } catch (error) {
      console.error('Error calculating totals:', error);
      return { subtotalSum: 0, impuestos: 0, total: 0 };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow border-l-4 border-gray-500 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Nueva Venta</h3>
        {isLoadingProductos ? (
          <div className="text-center text-gray-600">Cargando productos...</div>
        ) : (
          <Formik
            initialValues={{
              notas: '',
              metodoPago: 'Efectivo',
              detalleVenta: [{ productoId: '', cantidad: 1, descuentoPorcentaje: 0 }],
            }}
            validationSchema={Yup.object({
              notas: Yup.string().required('Requerido'),
              metodoPago: Yup.string().required('Requerido'),
              detalleVenta: Yup.array()
                .of(
                  Yup.object({
                    productoId: Yup.number().min(1, 'Seleccione un producto').required('Requerido'),
                    cantidad: Yup.number().min(1, 'Debe ser mayor a 0').required('Requerido'),
                    descuentoPorcentaje: Yup.number()
                      .min(0, 'No puede ser negativo')
                      .max(100, 'No puede ser mayor a 100%')
                      .required('Requerido'),
                  })
                )
                .min(1, 'Debe agregar al menos un producto'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              const transformedValues = {
                ...values,
                detalleVenta: values.detalleVenta.map(detalle => {
                  const producto = productos.find(p => (p.productoId || p.ProductoId) === Number(detalle.productoId));
                  const precio = producto ? (Number(producto.precioVenta || producto.PrecioVenta) || 0) : 0;
                  const cantidad = Number(detalle.cantidad) || 1;
                  const porcentajeDescuento = Number(detalle.descuentoPorcentaje) || 0;
                  const subtotalBruto = precio * cantidad;
                  const descuentoEnDolares = (subtotalBruto * porcentajeDescuento) / 100;
                  
                  return {
                    productoId: Number(detalle.productoId),
                    cantidad: cantidad,
                    descuento: descuentoEnDolares
                  };
                })
              };

              api
                .post('/Venta', transformedValues)
                .then(res => {
                  toast.success('Venta creada');
                  onSave(res.data);
                })
                .catch(error => {
                  const errorData = error.response?.data;
                  if (errorData?.Error === 'StockInsuficiente') {
                    toast.error(
                      `${errorData.Message} (Disponible: ${errorData.Details.StockDisponible}, Solicitado: ${errorData.Details.CantidadSolicitada})`
                    );
                  } else {
                    toast.error(errorData?.Message || 'Error al registrar la venta');
                  }
                })
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
                        {values.detalleVenta.map((detalle, index) => {
                          const producto = detalle.productoId && !isNaN(Number(detalle.productoId))
                            ? productos.find(p => (p.productoId || p.ProductoId) === Number(detalle.productoId))
                            : null;
                          
                          const precioUnitario = producto ? (Number(producto.precioVenta || producto.PrecioVenta) || 0) : 0;
                          const subtotal = calculateSubtotal(detalle, productos);
                          const subtotalBruto = precioUnitario * (Number(detalle.cantidad) || 1);
                          const montoDescuento = (subtotalBruto * (Number(detalle.descuentoPorcentaje) || 0)) / 100;

                          return (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 mb-6 items-start border-b pb-4">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                                <Field
                                  as="select"
                                  name={`detalleVenta[${index}].productoId`}
                                  className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-full shadow-sm"
                                >
                                  <option value="">Seleccione un producto</option>
                                  {productos.map(p => (
                                    <option key={p.productoId || p.ProductoId} value={p.productoId || p.ProductoId}>
                                      {(p.nombre || p.Nombre)} ({p.codigo || p.Codigo})
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name={`detalleVenta[${index}].productoId`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                                {producto && (
                                  <div className="text-sm text-gray-500 mt-1">
                                    Precio Unitario: {formatCurrency(precioUnitario)}
                                    {detalle.descuentoPorcentaje > 0 && (
                                      <div className="text-xs text-orange-600">
                                        Descuento: {detalle.descuentoPorcentaje}% (-{formatCurrency(montoDescuento)})
                                      </div>
                                    )}
                                  </div>
                                )}
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descuento (%)</label>
                                <Field
                                  name={`detalleVenta[${index}].descuentoPorcentaje`}
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                  className="bg-gray-50 border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 w-24 shadow-sm"
                                />
                                <ErrorMessage
                                  name={`detalleVenta[${index}].descuentoPorcentaje`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
                                <div className="bg-gray-100 border-gray-300 rounded-lg p-2.5 w-32 text-right font-medium">
                                  {formatCurrency(subtotal)}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2 mt-6 sm:mt-0"
                                disabled={values.detalleVenta.length === 1}
                              >
                                <FaTrash className="w-5 h-5" /> Eliminar
                              </button>
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => push({ productoId: '', cantidad: 1, descuentoPorcentaje: 0 })}
                          className="text-primary px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                        >
                          <FaPlus className="w-5 h-5" /> Agregar Producto
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Resumen</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-right font-medium text-gray-700">Subtotal:</div>
                    <div className="text-right">{formatCurrency(calculateTotals(values.detalleVenta, productos).subtotalSum)}</div>
                    <div className="text-right font-medium text-gray-700">Impuestos (16%):</div>
                    <div className="text-right">{formatCurrency(calculateTotals(values.detalleVenta, productos).impuestos)}</div>
                    <div className="text-right font-semibold text-gray-800">Total:</div>
                    <div className="text-right font-semibold">{formatCurrency(calculateTotals(values.detalleVenta, productos).total)}</div>
                  </div>
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
        )}
      </div>
    </div>
  );
}

export default VentaForm;