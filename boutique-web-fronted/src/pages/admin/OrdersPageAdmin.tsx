import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Clock, Truck, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import type { OrderBase } from '../../types/common';
import { showToast } from '../../utils/toast';

type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  procesando: { label: 'Procesando', color: 'bg-blue-100 text-blue-800', icon: Package },
  enviado: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
  entregado: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export const OrdersPageAdmin = () => {
  const [orders, setOrders] = useState<OrderBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderBase | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      setLoading(true);
      const ordersData = localStorage.getItem('orders');
      const allOrders: OrderBase[] = ordersData ? JSON.parse(ordersData) : [];
      // Ordenar por fecha más reciente
      allOrders.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
      setOrders(allOrders);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      showToast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, estado: newStatus } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      showToast.success('Estado del pedido actualizado');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      showToast.error('Error al actualizar estado');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pendiente: orders.filter(o => o.estado === 'pendiente').length,
    procesando: orders.filter(o => o.estado === 'procesando').length,
    enviado: orders.filter(o => o.estado === 'enviado').length,
    entregado: orders.filter(o => o.estado === 'entregado').length,
    cancelado: orders.filter(o => o.estado === 'cancelado').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Pedidos</h2>
        <p className="text-gray-600 mt-1">Gestiona todos los pedidos de clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-md p-4 text-white"
        >
          <p className="text-sm font-medium opacity-90">Total</p>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md p-4 text-white"
        >
          <p className="text-sm font-medium opacity-90">Pendientes</p>
          <p className="text-2xl font-bold mt-1">{stats.pendiente}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-4 text-white"
        >
          <p className="text-sm font-medium opacity-90">Procesando</p>
          <p className="text-2xl font-bold mt-1">{stats.procesando}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-4 text-white"
        >
          <p className="text-sm font-medium opacity-90">Enviados</p>
          <p className="text-2xl font-bold mt-1">{stats.enviado}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-4 text-white"
        >
          <p className="text-sm font-medium opacity-90">Entregados</p>
          <p className="text-2xl font-bold mt-1">{stats.entregado}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-4 text-white"
        >
          <p className="text-sm font-medium opacity-90">Cancelados</p>
          <p className="text-2xl font-bold mt-1">{stats.cancelado}</p>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de pedido o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="procesando">Procesando</option>
              <option value="enviado">Enviados</option>
              <option value="entregado">Entregados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.estado].icon;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-gray-900">{order.numero_pedido}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{order.user_email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(order.fecha_creacion).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {order.items.reduce((sum, item) => sum + item.cantidad, 0)} productos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">Bs {order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.estado].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[order.estado].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron pedidos</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Pedido {selectedOrder.numero_pedido}</h3>
                  <p className="text-gray-600 mt-1">{selectedOrder.user_email}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fecha de creación</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedOrder.fecha_creacion).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-gray-900">Bs {selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Producto ID: {item.producto_id}</p>
                        <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                      </div>
                      <p className="font-semibold text-gray-900">Bs {item.precio_unitario.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Change Status */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Cambiar Estado</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(Object.keys(statusConfig) as OrderStatus[]).map((status) => {
                    const StatusIcon = statusConfig[status].icon;
                    return (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          selectedOrder.estado === status
                            ? statusConfig[status].color
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {statusConfig[status].label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
