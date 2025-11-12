import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../context/CartContext';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string | number, cantidad: number) => void;
  onRemove: (itemId: string | number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const incrementQuantity = () => {
    if (item.cantidad < item.stock_disponible) {
      onUpdateQuantity(item.id, item.cantidad + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.cantidad > 1) {
      onUpdateQuantity(item.id, item.cantidad - 1);
    }
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Image */}
        <div className="w-full sm:w-32 h-32 flex-shrink-0">
          <div className="relative aspect-square bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-lg overflow-hidden">
            {item.imagen ? (
              <img
                src={item.imagen}
                alt={item.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                👗
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-raleway font-semibold text-lg text-boutique-black-matte mb-2">
              {item.nombre}
            </h3>
            
            {/* Attributes */}
            <div className="flex flex-wrap gap-3 mb-3">
              {item.talla && (
                <span className="text-sm font-poppins text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Talla: <span className="font-semibold">{item.talla}</span>
                </span>
              )}
              {item.color && (
                <span className="text-sm font-poppins text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Color: <span className="font-semibold">{item.color}</span>
                </span>
              )}
            </div>

            {/* Price */}
            <p className="font-raleway text-xl font-bold text-boutique-black-matte">
              ${item.precio.toFixed(2)}
            </p>
          </div>

          {/* Quantity Controls & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-poppins text-gray-600 font-medium">
                Cantidad:
              </span>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  disabled={item.cantidad <= 1}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-poppins font-semibold min-w-[3rem] text-center border-x-2 border-gray-200">
                  {item.cantidad}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={item.cantidad >= item.stock_disponible}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Subtotal & Remove */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-poppins text-gray-500 mb-1">Subtotal</p>
                <p className="font-raleway text-xl font-bold text-boutique-rose">
                  ${subtotal.toFixed(2)}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Eliminar producto"
              >
                <Trash2 size={20} />
              </motion.button>
            </div>
          </div>

          {/* Stock Warning */}
          {item.cantidad >= item.stock_disponible && (
            <p className="text-xs text-orange-600 font-poppins mt-2">
              ⚠️ Cantidad máxima disponible
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
