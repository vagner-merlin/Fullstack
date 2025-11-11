import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

const CartSummary = ({ subtotal, itemCount }: CartSummaryProps) => {
  const ENVIO_GRATIS_MINIMO = 50;
  const costoEnvio = subtotal >= ENVIO_GRATIS_MINIMO ? 0 : 5.99;
  const total = subtotal + costoEnvio;
  const faltaParaEnvioGratis = Math.max(0, ENVIO_GRATIS_MINIMO - subtotal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 sticky top-24"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
        <ShoppingBag size={24} className="text-boutique-rose" />
        <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte">
          Resumen
        </h2>
      </div>

      {/* Items Count */}
      <div className="mb-6">
        <p className="font-poppins text-gray-600">
          {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
        </p>
      </div>

      {/* Free Shipping Progress */}
      {faltaParaEnvioGratis > 0 ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={18} className="text-blue-600" />
            <p className="font-poppins text-sm text-blue-800 font-medium">
              ¡Envío gratis desde ${ENVIO_GRATIS_MINIMO}!
            </p>
          </div>
          <p className="font-poppins text-xs text-blue-700">
            Te faltan <span className="font-bold">${faltaParaEnvioGratis.toFixed(2)}</span> para envío gratis
          </p>
          <div className="mt-2 bg-blue-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / ENVIO_GRATIS_MINIMO) * 100, 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-green-600" />
            <p className="font-poppins text-sm text-green-800 font-medium">
              ✓ ¡Envío gratis en este pedido!
            </p>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-poppins text-gray-600">Subtotal</span>
          <span className="font-raleway text-lg font-semibold text-boutique-black-matte">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-poppins text-gray-600">Envío</span>
          <span className={`font-raleway text-lg font-semibold ${
            costoEnvio === 0 ? 'text-green-600' : 'text-boutique-black-matte'
          }`}>
            {costoEnvio === 0 ? 'GRATIS' : `$${costoEnvio.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
        <span className="font-raleway text-xl font-bold text-boutique-black-matte">
          Total
        </span>
        <span className="font-raleway text-3xl font-bold text-boutique-rose">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <Link to="/checkout">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-boutique-black-matte text-white py-4 px-6 rounded-lg font-poppins font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg mb-3"
        >
          <ShoppingBag size={20} />
          <span>Proceder al pago</span>
        </motion.button>
      </Link>

      {/* Continue Shopping */}
      <Link to="/shop">
        <button className="w-full border-2 border-gray-300 text-boutique-black-matte py-3 px-6 rounded-lg font-poppins font-medium hover:border-boutique-black-matte hover:bg-gray-50 transition-colors">
          Seguir comprando
        </button>
      </Link>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Lock size={16} />
          <span className="font-poppins text-xs">Pago 100% seguro y protegido</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-4">
        <p className="font-poppins text-xs text-gray-500 text-center mb-2">
          Aceptamos
        </p>
        <div className="flex items-center justify-center gap-3 opacity-60">
          <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-semibold">VISA</div>
          <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-semibold">MC</div>
          <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-semibold">AMEX</div>
          <div className="bg-gray-100 px-3 py-1.5 rounded text-xs font-semibold">PayPal</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
