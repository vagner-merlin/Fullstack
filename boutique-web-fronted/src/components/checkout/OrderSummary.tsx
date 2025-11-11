import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import type { Order } from '../../services/orderService';

interface OrderSummaryProps {
  order: Order;
  showTitle?: boolean;
}

const OrderSummary = ({ order, showTitle = true }: OrderSummaryProps) => {
  const getStatusBadge = (estado: Order['estado']) => {
    const badges = {
      pendiente: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      procesando: { color: 'bg-blue-100 text-blue-800', text: 'Procesando' },
      enviado: { color: 'bg-purple-100 text-purple-800', text: 'Enviado' },
      entregado: { color: 'bg-green-100 text-green-800', text: 'Entregado' },
      cancelado: { color: 'bg-red-100 text-red-800', text: 'Cancelado' },
    };
    
    const badge = badges[estado] || badges.pendiente;
    
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-poppins font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-raleway text-xl font-bold text-boutique-black-matte flex items-center gap-2">
            <ShoppingBag size={24} className="text-boutique-rose" />
            Resumen del Pedido
          </h3>
          {getStatusBadge(order.estado)}
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4 mb-6">
        {order.items.map((item, index) => (
          <motion.div
            key={`${item.inventario_id}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-lg flex-shrink-0 flex items-center justify-center">
              <span className="text-3xl">👗</span>
            </div>
            
            <div className="flex-1">
              <p className="font-poppins font-semibold text-boutique-black-matte">
                {item.productName || `Producto ID: ${item.producto_id}`}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {item.talla && (
                  <span className="text-xs font-poppins bg-white px-2 py-1 rounded-full text-gray-700">
                    Talla: <strong>{item.talla}</strong>
                  </span>
                )}
                {item.color && (
                  <span className="text-xs font-poppins bg-white px-2 py-1 rounded-full text-gray-700">
                    Color: <strong>{item.color}</strong>
                  </span>
                )}
                <span className="text-xs font-poppins bg-white px-2 py-1 rounded-full text-gray-700">
                  Cantidad: <strong>{item.cantidad}</strong>
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <p className="font-poppins text-sm text-gray-600">
                  ${item.precio_unitario.toFixed(2)} × {item.cantidad}
                </p>
                <p className="font-raleway text-lg font-bold text-boutique-rose">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between font-poppins text-sm">
          <span className="text-gray-600">Subtotal ({order.items.length} {order.items.length === 1 ? 'producto' : 'productos'})</span>
          <span className="font-semibold text-boutique-black-matte">
            ${order.subtotal.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between font-poppins text-sm">
          <span className="text-gray-600">Costo de Envío</span>
          <span className={`font-semibold ${order.costo_envio === 0 ? 'text-green-600' : 'text-boutique-black-matte'}`}>
            {order.costo_envio === 0 ? 'GRATIS' : `$${order.costo_envio.toFixed(2)}`}
          </span>
        </div>

        {order.costo_envio === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="font-poppins text-xs text-green-800 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Has calificado para envío gratis (compra mayor a $50)
            </p>
          </div>
        )}
        
        <div className="flex justify-between font-raleway text-lg border-t border-gray-200 pt-3">
          <span className="font-bold text-boutique-black-matte">Total</span>
          <span className="font-bold text-boutique-rose text-2xl">
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Order Details Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="font-poppins text-xs text-blue-700 mb-1">Productos</p>
            <p className="font-raleway text-xl font-bold text-blue-900">
              {order.items.reduce((sum, item) => sum + item.cantidad, 0)}
            </p>
          </div>
          <div>
            <p className="font-poppins text-xs text-blue-700 mb-1">Estado</p>
            <p className="font-raleway text-sm font-bold text-blue-900">
              {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
export { OrderSummary };
