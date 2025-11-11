import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, Smartphone, Check, X } from 'lucide-react';
import { QuickProductSearch } from '../../components/seller/QuickProductSearch';
import { PosCart, type PosCartItem } from '../../components/seller/PosCart';
import type { Product } from '../../services/productService';
import { createSale } from '../../services/seller/posService';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/toast';

type PaymentMethod = 'efectivo' | 'tarjeta' | 'qr';

export const PosPage = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<PosCartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProductSelect = (product: Product) => {
    if (product.stock <= 0) {
      showToast.error('Producto sin stock');
      return;
    }

    const existingItem = cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        showToast.error('Stock insuficiente');
        return;
      }
      handleUpdateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price;

      const newItem: PosCartItem = {
        product,
        quantity: 1,
        subtotal: finalPrice,
      };
      setCartItems([...cartItems, newItem]);
      showToast.success(`${product.name} añadido`);
    }
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            showToast.error('Stock insuficiente');
            return item;
          }
          const finalPrice = item.product.discount 
            ? item.product.price * (1 - item.product.discount / 100) 
            : item.product.price;
          
          return {
            ...item,
            quantity,
            subtotal: finalPrice * quantity,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    showToast.info('Producto eliminado');
  };

  const handleClearCart = () => {
    if (confirm('¿Limpiar todo el carrito?')) {
      setCartItems([]);
      showToast.info('Carrito limpiado');
    }
  };

  const openPaymentModal = () => {
    if (cartItems.length === 0) {
      showToast.error('El carrito está vacío');
      return;
    }
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentMethod('efectivo');
    setClientName('');
    setClientPhone('');
  };

  const handleCompleteSale = async () => {
    if (!user) {
      showToast.error('No hay usuario autenticado');
      return;
    }

    try {
      setProcessing(true);

      const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const descuentoTotal = cartItems.reduce((sum, item) => {
        const discount = item.product.discount || 0;
        const discountAmount = item.product.price * item.quantity * (discount / 100);
        return sum + discountAmount;
      }, 0);

      const sale = createSale({
        seller_id: user.id,
        seller_name: `${user.first_name} ${user.last_name}`,
        items: cartItems.map(item => ({
          producto_id: item.product.id,
          inventario_id: item.product.id, // Mock
          productName: item.product.name,
          cantidad: item.quantity,
          precio_unitario: item.product.discount 
            ? item.product.price * (1 - item.product.discount / 100) 
            : item.product.price,
        })),
        subtotal,
        descuento_total: descuentoTotal,
        total: subtotal,
        metodo_pago: paymentMethod,
        cliente_nombre: clientName || undefined,
        cliente_telefono: clientPhone || undefined,
      });

      showToast.success(`Venta ${sale.numero_venta} registrada exitosamente`);
      
      // Limpiar
      setCartItems([]);
      closePaymentModal();
    } catch (error) {
      console.error('Error al registrar venta:', error);
      showToast.error('Error al registrar la venta');
    } finally {
      setProcessing(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Punto de Venta</h2>
        <p className="text-gray-600 mt-2">Registra ventas en tienda física</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Search */}
        <div className="lg:col-span-2 space-y-6">
          <QuickProductSearch onProductSelect={handleProductSelect} />

          {/* Quick Info */}
          <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-2">💡 Consejos Rápidos</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Busca productos por nombre o código</li>
              <li>• Los descuentos se aplican automáticamente</li>
              <li>• Verifica el stock antes de vender</li>
            </ul>
          </div>
        </div>

        {/* Right Column - Cart */}
        <div className="h-[600px]">
          <PosCart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClear={handleClearCart}
          />
        </div>
      </div>

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-gray-200 shadow-2xl lg:static lg:border-0 lg:shadow-none lg:p-0">
          <button
            onClick={openPaymentModal}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <CreditCard className="h-6 w-6" />
            Procesar Pago - Bs {total.toFixed(2)}
          </button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Procesar Pago</h3>
                <button
                  onClick={closePaymentModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Total */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-indigo-700 mb-1">Total a cobrar</p>
                <p className="text-4xl font-bold text-indigo-900">
                  Bs {total.toFixed(2)}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'efectivo'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Banknote className={`h-8 w-8 ${
                      paymentMethod === 'efectivo' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      paymentMethod === 'efectivo' ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      Efectivo
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'tarjeta'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className={`h-8 w-8 ${
                      paymentMethod === 'tarjeta' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      paymentMethod === 'tarjeta' ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      Tarjeta
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('qr')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'qr'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className={`h-8 w-8 ${
                      paymentMethod === 'qr' ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      paymentMethod === 'qr' ? 'text-purple-700' : 'text-gray-600'
                    }`}>
                      QR
                    </span>
                  </button>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente (Opcional)
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ingresa el nombre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ingresa el teléfono"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={closePaymentModal}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCompleteSale}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all font-bold disabled:opacity-50"
              >
                <Check className="h-5 w-5" />
                {processing ? 'Procesando...' : 'Confirmar Venta'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
