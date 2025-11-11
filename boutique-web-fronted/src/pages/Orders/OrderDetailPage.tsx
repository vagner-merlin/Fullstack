import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle, Clock, ShoppingCart, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import { OrderSummary } from '../../components/checkout';
import { orderService, type Order } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const loadOrder = async () => {
    if (!id) {
      navigate('/orders');
      return;
    }

    try {
      const data = await orderService.getOrderById(parseInt(id));
      if (!data) {
        throw new Error('Pedido no encontrado');
      }
      setOrder(data);
    } catch (error) {
      console.error('Error al cargar pedido:', error);
      alert('No se pudo cargar el pedido');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleReorder = async () => {
    if (!order) return;

    setReordering(true);
    try {
      // Agregar todos los items del pedido al carrito
      for (const item of order.items) {
        await addItem({
          id: Date.now() + Math.random(), // ID temporal
          inventario_id: item.inventario_id,
          producto_id: item.producto_id,
          nombre: item.productName || `Producto #${item.producto_id}`,
          precio: item.precio_unitario,
          cantidad: item.cantidad,
          imagen: '/placeholder-product.jpg', // En producción vendría del backend
          talla: item.talla,
          color: item.color,
          stock_disponible: 100, // Valor por defecto, en producción vendría del backend
        });
      }

      // Redirigir al carrito
      navigate('/cart');
    } catch (error) {
      console.error('Error al repetir pedido:', error);
      alert('Error al agregar productos al carrito');
    } finally {
      setReordering(false);
    }
  };

  const getStatusTimeline = () => {
    if (!order) return [];

    const allSteps = [
      { status: 'pendiente', label: 'Pedido Recibido', icon: CheckCircle },
      { status: 'procesando', label: 'En Preparación', icon: Package },
      { status: 'enviado', label: 'En Camino', icon: Truck },
      { status: 'entregado', label: 'Entregado', icon: CheckCircle },
    ];

    const statusOrder: Order['estado'][] = ['pendiente', 'procesando', 'enviado', 'entregado'];
    const currentIndex = statusOrder.indexOf(order.estado);

    if (order.estado === 'cancelado') {
      return [
        { status: 'cancelado', label: 'Pedido Cancelado', icon: Clock, active: true, completed: false },
      ];
    }

    return allSteps.map((step, index) => ({
      ...step,
      active: index === currentIndex,
      completed: index < currentIndex,
    }));
  };

  const getPaymentMethodInfo = () => {
    const methods = {
      qr: { name: 'QR Simple', icon: '📱' },
      tarjeta: { name: 'Tarjeta', icon: '💳' },
      efectivo: { name: 'Efectivo', icon: '💵' },
    };
    return methods[order?.metodo_pago || 'efectivo'];
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-black-matte"></div>
            <p className="font-poppins text-gray-600 mt-4">Cargando pedido...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!order) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft flex items-center justify-center">
          <div className="text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="font-raleway text-2xl font-bold text-gray-800 mb-2">
              Pedido no encontrado
            </h2>
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 px-6 py-3 bg-boutique-black-matte text-white rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors"
            >
              Ver mis pedidos
            </button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const timeline = getStatusTimeline();
  const paymentMethod = getPaymentMethodInfo();

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

              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte mb-2">
                    Pedido #{order.numero_pedido}
                  </h1>
                  <p className="font-poppins text-gray-600 text-lg">
                    Realizado el {new Date(order.fecha_creacion).toLocaleDateString('es-BO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <button
                  onClick={handleReorder}
                  disabled={reordering || order.estado === 'cancelado'}
                  className="flex items-center gap-2 px-6 py-3 bg-boutique-rose text-white rounded-lg font-poppins font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reordering ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Agregando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Repetir Pedido
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-8"
              >
                <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte mb-6">
                  Estado del Pedido
                </h2>

                <div className="relative">
                  {timeline.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === timeline.length - 1;

                    return (
                      <div key={step.status} className="relative">
                        <div className="flex items-start gap-4 pb-8">
                          <div className="relative flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              step.completed 
                                ? 'bg-green-500' 
                                : step.active 
                                  ? 'bg-boutique-rose' 
                                  : step.status === 'cancelado'
                                    ? 'bg-red-500'
                                    : 'bg-gray-300'
                            }`}>
                              <Icon size={24} className="text-white" />
                            </div>
                            {!isLast && (
                              <div className={`w-0.5 h-16 mt-2 ${
                                step.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`} />
                            )}
                          </div>

                          <div className="flex-1 pt-2">
                            <h3 className={`font-raleway text-lg font-bold ${
                              step.active || step.completed ? 'text-boutique-black-matte' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </h3>
                            {step.active && (
                              <p className="font-poppins text-sm text-gray-600 mt-1">
                                En proceso
                              </p>
                            )}
                            {step.completed && (
                              <p className="font-poppins text-sm text-green-600 mt-1">
                                ✓ Completado
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Order Summary */}
              <OrderSummary order={order} showTitle={true} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={20} className="text-boutique-rose" />
                  <h3 className="font-raleway text-lg font-bold text-boutique-black-matte">
                    Dirección de Envío
                  </h3>
                </div>

                <div className="space-y-2">
                  <p className="font-poppins text-sm font-semibold text-gray-900">
                    {order.direccion_envio.nombre_completo}
                  </p>
                  <p className="font-poppins text-sm text-gray-700">
                    {order.direccion_envio.direccion}
                  </p>
                  <p className="font-poppins text-sm text-gray-700">
                    {order.direccion_envio.ciudad}, {order.direccion_envio.departamento}
                  </p>
                  {order.direccion_envio.codigo_postal && (
                    <p className="font-poppins text-sm text-gray-700">
                      CP: {order.direccion_envio.codigo_postal}
                    </p>
                  )}
                  {order.direccion_envio.referencias && (
                    <p className="font-poppins text-xs text-gray-600 italic mt-2">
                      Ref: {order.direccion_envio.referencias}
                    </p>
                  )}
                  <p className="font-poppins text-sm text-gray-700 pt-2 border-t border-gray-200">
                    Tel: {order.direccion_envio.telefono}
                  </p>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard size={20} className="text-boutique-rose" />
                  <h3 className="font-raleway text-lg font-bold text-boutique-black-matte">
                    Método de Pago
                  </h3>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{paymentMethod.icon}</span>
                  <span className="font-poppins text-sm font-semibold text-gray-900">
                    {paymentMethod.name}
                  </span>
                </div>
              </motion.div>

              {/* Order Date */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={20} className="text-boutique-rose" />
                  <h3 className="font-raleway text-lg font-bold text-boutique-black-matte">
                    Información Adicional
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-poppins text-xs text-gray-500">Fecha de pedido</p>
                    <p className="font-poppins text-sm font-semibold text-gray-900">
                      {new Date(order.fecha_creacion).toLocaleDateString('es-BO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins text-xs text-gray-500">Última actualización</p>
                    <p className="font-poppins text-sm font-semibold text-gray-900">
                      {new Date(order.fecha_actualizacion).toLocaleDateString('es-BO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderDetailPage;
