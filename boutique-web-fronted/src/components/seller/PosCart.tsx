import { Trash2, Plus, Minus } from 'lucide-react';
import type { Product } from '../../services/productService';

export interface PosCartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface PosCartProps {
  items: PosCartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClear: () => void;
}

export const PosCart = ({ items, onUpdateQuantity, onRemoveItem, onClear }: PosCartProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const descuentoTotal = items.reduce((sum, item) => {
    const discount = item.product.discount || 0;
    const discountAmount = item.product.price * item.quantity * (discount / 100);
    return sum + discountAmount;
  }, 0);
  const total = subtotal;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Carrito ({items.length})
        </h3>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">El carrito está vacío</p>
            <p className="text-sm text-gray-400 mt-2">
              Busca y añade productos
            </p>
          </div>
        ) : (
          items.map((item) => {
            const finalPrice = item.product.discount 
              ? item.product.price * (1 - item.product.discount / 100) 
              : item.product.price;

            return (
              <div
                key={item.product.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  {item.product.images[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {item.product.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-600">
                        Bs {finalPrice.toFixed(2)}
                      </span>
                      {item.product.discount && item.product.discount > 0 && (
                        <span className="text-xs text-gray-500 line-through">
                          Bs {item.product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-lg font-bold text-gray-900">
                      Bs {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">
              Bs {(subtotal + descuentoTotal).toFixed(2)}
            </span>
          </div>
          {descuentoTotal > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Descuento</span>
              <span className="font-semibold text-green-600">
                - Bs {descuentoTotal.toFixed(2)}
              </span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-indigo-600">
                Bs {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
