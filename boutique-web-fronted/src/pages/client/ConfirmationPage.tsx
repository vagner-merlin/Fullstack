import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, Clock, ArrowLeft, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { OrderSummary } from '../../components/checkout';
import { orderService, type Order } from '../../services/orderService';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('No se proporcionó un ID de pedido');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await orderService.getOrderById(Number(orderId));
        if (orderData) {
          setOrder(orderData);
        } else {
          setError('Pedido no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar pedido:', err);
        setError('Error al cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-card mb-4">
              <div className="w-16 h-16 border-4 border-boutique-rose border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="font-poppins text-gray-600">Cargando información del pedido...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !order) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft flex items-center justify-center py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-card p-12 text-center"
          >
            <div className="inline-block p-6 bg-red-100 rounded-full mb-6">
              <Package size={64} className="text-red-600" />
            </div>
            <h2 className="font-raleway text-3xl font-bold text-boutique-black-matte mb-4">
              {error || 'Pedido no encontrado'}
            </h2>
            <p className="font-poppins text-gray-600 mb-8">
              No pudimos encontrar la información de este pedido
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-boutique-black-matte text-white px-8 py-3 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors"
            >
              Ver mis pedidos
            </button>
          </motion.div>
        </div>
      </PublicLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstimatedDelivery = () => {
    const date = new Date(order.fecha_creacion);
    date.setDate(date.getDate() + 7); // 7 días de estimación
    return date.toLocaleDateString('es-BO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPaymentMethodName = () => {
    switch (order.metodo_pago) {
      case 'qr':
        return 'QR Simple/Tigo Money';
      case 'tarjeta':
        return 'Tarjeta de Crédito/Débito';
      case 'efectivo':
        return 'Pago Contra Entrega';
      default:
        return order.metodo_pago;
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Back Button */}
              <button
                onClick={() => navigate('/orders')}
                className="flex items-center space-x-2 text-gray-600 hover:text-boutique-black-matte mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-poppins text-sm">Volver a mis pedidos</span>
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div>
                  <h1 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte">
                    ¡Pedido Confirmado!
                  </h1>
                  <p className="font-poppins text-gray-600 text-lg mt-1">
                    Tu pedido ha sido recibido y está siendo procesado
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-poppins text-sm text-gray-600 mb-1">Número de Pedido</p>
                    <h2 className="font-raleway text-3xl font-bold text-boutique-black-matte">
                      #{order.id.toString().padStart(6, '0')}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins text-sm text-gray-600 mb-1">Fecha</p>
                    <p className="font-poppins text-sm font-semibold text-boutique-black-matte">
                      {formatDate(order.fecha_creacion)}
                    </p>
                  </div>
                </div>

                {/* Order Summary Component */}
                <OrderSummary order={order} />
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-8"
              >
                <h3 className="font-raleway text-xl font-bold text-boutique-black-matte mb-4 flex items-center gap-2">
                  <Truck size={24} className="text-boutique-rose" />
                  Dirección de Envío
                </h3>
                <div className="bg-boutique-beige rounded-lg p-6">
                  <p className="font-poppins font-semibold text-boutique-black-matte mb-2">
                    {order.direccion_envio.nombre_completo}
                  </p>
                  <p className="font-poppins text-sm text-gray-700 mb-1">
                    {order.direccion_envio.direccion}
                  </p>
                  <p className="font-poppins text-sm text-gray-700 mb-1">
                    {order.direccion_envio.ciudad}, {order.direccion_envio.departamento}
                  </p>
                  {order.direccion_envio.codigo_postal && (
                    <p className="font-poppins text-sm text-gray-700 mb-1">
                      CP: {order.direccion_envio.codigo_postal}
                    </p>
                  )}
                  <p className="font-poppins text-sm text-gray-700 mt-3">
                    <strong>Teléfono:</strong> {order.direccion_envio.telefono}
                  </p>
                  {order.direccion_envio.referencias && (
                    <p className="font-poppins text-sm text-gray-600 mt-2 italic">
                      Referencias: {order.direccion_envio.referencias}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-8"
              >
                <h3 className="font-raleway text-xl font-bold text-boutique-black-matte mb-4">
                  Método de Pago
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="font-poppins font-semibold text-boutique-black-matte">
                    {getPaymentMethodName()}
                  </p>
                  <p className="font-poppins text-sm text-gray-600 mt-1">
                    {order.metodo_pago === 'efectivo' && 'Pagarás al recibir tu pedido'}
                    {order.metodo_pago === 'qr' && 'Pago procesado exitosamente'}
                    {order.metodo_pago === 'tarjeta' && 'Pago procesado exitosamente'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 sticky top-24"
              >
                <h3 className="font-raleway text-lg font-bold text-boutique-black-matte mb-4">
                  ¿Qué sigue?
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Mail size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-poppins text-sm font-semibold text-boutique-black-matte">
                        Confirmación por Email
                      </p>
                      <p className="font-poppins text-xs text-gray-600 mt-1">
                        Te enviaremos un correo con los detalles
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <Package size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-poppins text-sm font-semibold text-boutique-black-matte">
                        Preparación
                      </p>
                      <p className="font-poppins text-xs text-gray-600 mt-1">
                        Procesaremos tu pedido en 24 horas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                      <Truck size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-poppins text-sm font-semibold text-boutique-black-matte">
                        Envío
                      </p>
                      <p className="font-poppins text-xs text-gray-600 mt-1">
                        Entrega estimada: {getEstimatedDelivery()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                      <Clock size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-poppins text-sm font-semibold text-boutique-black-matte">
                        Seguimiento
                      </p>
                      <p className="font-poppins text-xs text-gray-600 mt-1">
                        Podrás rastrear tu pedido en tiempo real
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-boutique-black-matte text-boutique-black-matte rounded-lg font-poppins font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Download size={18} />
                    <span>Descargar Comprobante</span>
                  </button>

                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full px-4 py-3 bg-boutique-black-matte text-white rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Ver mis pedidos
                  </button>

                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full px-4 py-3 border-2 border-gray-300 text-boutique-black-matte rounded-lg font-poppins font-medium hover:bg-gray-50 transition-colors"
                  >
                    Seguir comprando
                  </button>
                </div>
              </motion.div>

              {/* Support Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-boutique-rose-light to-boutique-beige rounded-xl p-6"
              >
                <h3 className="font-raleway text-lg font-bold text-boutique-black-matte mb-3">
                  ¿Necesitas ayuda?
                </h3>
                <p className="font-poppins text-sm text-gray-700 mb-4">
                  Nuestro equipo está listo para asistirte
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-white text-boutique-black-matte px-4 py-2 rounded-lg font-poppins font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Contactar Soporte
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ConfirmationPage;
