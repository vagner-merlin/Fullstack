import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useNotifications } from '../../hooks/useNotifications';
import PublicLayout from '../../components/layout/PublicLayout';
import AddressForm from '../../components/checkout/AddressForm';
import PaymentMethod from '../../components/checkout/PaymentMethod';
import { orderService } from '../../services/orderService';
import { showToast } from '../../utils/toast';
import type { ShippingAddress, PaymentMethodType } from '../../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    nombre_completo: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigo_postal: '',
    referencias: '',
  });

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('qr');

  const ENVIO_COSTO = total >= 50 ? 0 : 5.99;
  const totalFinal = total + ENVIO_COSTO;

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-b from-white to-boutique-gray-soft flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-6"
          >
            <div className="inline-block p-8 bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-full mb-6">
              <Package size={64} className="text-gray-400" />
            </div>
            <h2 className="font-raleway text-3xl font-bold text-boutique-black-matte mb-4">
              Tu carrito está vacío
            </h2>
            <p className="font-poppins text-gray-600 mb-8">
              Agrega productos para continuar con tu compra
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-boutique-black-matte text-white px-10 py-4 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors shadow-lg"
            >
              Ir a la tienda
            </button>
          </motion.div>
        </div>
      </PublicLayout>
    );
  }

  const handleAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = async (paymentMethod: PaymentMethodType) => {
    setSelectedPayment(paymentMethod);
    setIsProcessing(true);

    try {
      // Crear el pedido
      const orderData = {
        items: items.map(item => ({
          producto_id: item.producto_id,
          inventario_id: item.inventario_id,
          productName: item.nombre, // Incluir nombre del producto
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          talla: item.talla,
          color: item.color,
        })),
        direccion_envio: shippingAddress,
        metodo_pago: paymentMethod,
        subtotal: total,
        costo_envio: ENVIO_COSTO,
        total: totalFinal,
      };

      const newOrder = await orderService.createOrder(orderData);
      
      // Crear notificación
      await addNotification({
        type: 'order',
        title: '¡Pedido realizado!',
        message: `Tu pedido #${newOrder.numero_pedido} ha sido confirmado`,
        link: `/orders/${newOrder.id}`,
      });
      
      // Mostrar toast de éxito
      showToast.success('¡Pedido realizado exitosamente!');
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a página de confirmación
      navigate(`/confirmation?order=${newOrder.id}`, { replace: true });
    } catch (error) {
      console.error('Error al crear pedido:', error);
      showToast.error('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
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
                onClick={() => currentStep === 'address' ? navigate('/cart') : setCurrentStep('address')}
                className="flex items-center space-x-2 text-gray-600 hover:text-boutique-black-matte mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-poppins text-sm">
                  {currentStep === 'address' ? 'Volver al carrito' : 'Volver a dirección'}
                </span>
              </button>

              <h1 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte mb-4">
                Finalizar Compra
              </h1>

              {/* Progress Steps */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-poppins font-semibold ${
                    currentStep === 'address' 
                      ? 'bg-boutique-black-matte text-white' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {currentStep === 'payment' ? '✓' : '1'}
                  </div>
                  <span className="font-poppins text-sm font-medium">Dirección</span>
                </div>
                
                <div className="flex-1 h-0.5 bg-gray-300">
                  <div className={`h-full transition-all duration-300 ${
                    currentStep === 'payment' ? 'bg-boutique-black-matte w-full' : 'w-0'
                  }`} />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-poppins font-semibold ${
                    currentStep === 'payment' 
                      ? 'bg-boutique-black-matte text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="font-poppins text-sm font-medium">Pago</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2">
              {currentStep === 'address' ? (
                <AddressForm 
                  initialData={shippingAddress}
                  onSubmit={handleAddressSubmit}
                />
              ) : (
                <PaymentMethod
                  selectedMethod={selectedPayment}
                  onSubmit={handlePaymentSubmit}
                  isProcessing={isProcessing}
                />
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6 sticky top-24"
              >
                <h2 className="font-raleway text-xl font-bold text-boutique-black-matte mb-6">
                  Resumen del Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.inventario_id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-lg overflow-hidden flex-shrink-0">
                        {item.imagen && (
                          <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins text-sm font-semibold text-boutique-black-matte truncate">
                          {item.nombre}
                        </p>
                        <p className="font-poppins text-xs text-gray-600">
                          Cantidad: {item.cantidad}
                        </p>
                        <p className="font-raleway text-sm font-bold text-boutique-rose">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="font-poppins text-xs text-gray-500 text-center">
                      +{items.length - 3} productos más
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between font-poppins text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-poppins text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className={`font-semibold ${ENVIO_COSTO === 0 ? 'text-green-600' : ''}`}>
                      {ENVIO_COSTO === 0 ? 'GRATIS' : `$${ENVIO_COSTO.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-raleway text-lg border-t border-gray-200 pt-3">
                    <span className="font-bold text-boutique-black-matte">Total</span>
                    <span className="font-bold text-boutique-rose">
                      ${totalFinal.toFixed(2)}
                    </span>
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

export default CheckoutPage;
