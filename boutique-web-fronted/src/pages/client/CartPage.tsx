import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, itemCount, total } = useCart();

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
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-boutique-black-matte mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="font-poppins text-sm">Volver</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart size={32} className="text-boutique-rose" />
                <h1 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte">
                  Carrito de Compras
                </h1>
              </div>
              <p className="font-poppins text-gray-600 text-lg">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </motion.div>
          </div>
        </div>

        {/* Cart Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
          {items.length === 0 ? (
            /* Empty Cart */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-12 text-center shadow-md"
            >
              <div className="inline-block p-8 bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-full mb-6">
                <ShoppingCart size={64} className="text-gray-400" />
              </div>
              <h2 className="font-raleway text-3xl font-bold text-boutique-black-matte mb-4">
                Tu carrito está vacío
              </h2>
              <p className="font-poppins text-gray-600 mb-8 max-w-md mx-auto">
                Agrega productos a tu carrito para comenzar tu experiencia de compra
              </p>
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-boutique-black-matte text-white px-10 py-4 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Explorar Productos
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={(itemId, quantity) => updateQuantity(itemId, quantity)}
                      onRemove={(itemId) => removeItem(itemId)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <CartSummary subtotal={total} itemCount={itemCount} />
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CartPage;
