import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import type { Order } from '../../services/orderService';

interface OrderCardProps {
  order: Order;
  index?: number;
}

const OrderCard = ({ order, index = 0 }: OrderCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (estado: Order['estado']) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      procesando: 'bg-blue-100 text-blue-800 border-blue-300',
      enviado: 'bg-purple-100 text-purple-800 border-purple-300',
      entregado: 'bg-green-100 text-green-800 border-green-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[estado];
  };

  const getStatusText = (estado: Order['estado']) => {
    const texts = {
      pendiente: 'Pendiente',
      procesando: 'Procesando',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };
    return texts[estado];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/orders/${order.id}`)}
    >
      <div className="p-6">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-boutique-rose" />
                <h3 className="font-raleway text-xl font-bold text-boutique-black-matte">
                  Pedido #{order.numero_pedido}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-poppins font-semibold border ${getStatusColor(order.estado)}`}>
                {getStatusText(order.estado)}
              </span>
            </div>
            <p className="font-poppins text-sm text-gray-600">
              {formatDate(order.fecha_creacion)}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/orders/${order.id}`);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-boutique-black-matte text-white rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors shrink-0"
          >
            Ver Detalles
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Order Items Preview */}
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-2 mb-4">
            {order.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👗</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-sm font-semibold text-gray-900 truncate">
                    {item.productName || `Producto #${item.producto_id}`}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {item.talla && (
                      <span className="font-poppins text-xs text-gray-600">
                        Talla: {item.talla}
                      </span>
                    )}
                    {item.color && (
                      <span className="font-poppins text-xs text-gray-600">
                        • Color: {item.color}
                      </span>
                    )}
                    <span className="font-poppins text-xs text-gray-600">
                      • Cant: {item.cantidad}
                    </span>
                  </div>
                </div>
                <p className="font-poppins text-sm font-semibold text-gray-700">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="font-poppins text-xs text-gray-500 pl-15">
                +{order.items.length - 2} producto(s) más
              </p>
            )}
          </div>

          {/* Total and Items Count */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="font-poppins text-sm text-gray-600">
                {totalItems} artículo{totalItems !== 1 ? 's' : ''}
              </span>
              {order.costo_envio === 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-poppins font-semibold rounded-full">
                  Envío gratis
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="font-poppins text-xs text-gray-500">Total</p>
              <p className="font-raleway text-2xl font-bold text-boutique-black-matte">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
