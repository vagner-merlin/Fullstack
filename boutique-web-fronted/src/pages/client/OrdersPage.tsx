import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import OrderCard from '../../components/orders/OrderCard';
import { orderService, type Order } from '../../services/orderService';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['estado'] | 'todos'>('todos');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderService.getOrders();
        const sorted = data.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
        setOrders(sorted);
        setFilteredOrders(sorted);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...orders];

    // Filtrar por estado
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(order => order.estado === statusFilter);
    }

    // Filtrar por búsqueda (número de pedido)
    if (searchTerm.trim()) {
      filtered = filtered.filter(order => 
        order.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

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

              <h1 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte mb-4">
                Mis Pedidos
              </h1>
              <p className="font-poppins text-gray-600 text-lg">
                Historial de tus compras • {orders.length} pedido{orders.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        {orders.length > 0 && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por número de pedido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Order['estado'] | 'todos')}
                    className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all appearance-none bg-white min-w-[200px]"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="procesando">Procesando</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Results count */}
              {searchTerm || statusFilter !== 'todos' ? (
                <p className="font-poppins text-sm text-gray-600 mt-4">
                  Mostrando {filteredOrders.length} de {orders.length} pedidos
                </p>
              ) : null}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-black-matte"></div>
              <p className="font-poppins text-gray-600 mt-4">Cargando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-12 text-center"
            >
              <div className="inline-block p-8 bg-gradient-to-br from-boutique-beige to-boutique-rose-light rounded-full mb-6">
                <Package size={64} className="text-gray-400" />
              </div>
              
              <h2 className="font-raleway text-3xl font-bold text-boutique-black-matte mb-4">
                Aún no tienes pedidos
              </h2>
              
              <p className="font-poppins text-gray-600 mb-8 max-w-md mx-auto">
                Cuando realices tu primera compra, aparecerá aquí
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/shop')}
                  className="bg-boutique-black-matte text-white px-10 py-4 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Explorar Productos
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-3">
                  <Clock size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-raleway font-bold text-boutique-black-matte mb-2">
                      Seguimiento de Pedidos
                    </h3>
                    <p className="font-poppins text-sm text-gray-700">
                      Una vez que realices un pedido, podrás ver su estado en tiempo real, 
                      desde la confirmación hasta la entrega. Recibirás notificaciones por 
                      correo electrónico en cada etapa del proceso.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-12 text-center"
            >
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte mb-2">
                No se encontraron pedidos
              </h2>
              <p className="font-poppins text-gray-600">
                Intenta cambiar los filtros de búsqueda
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('todos');
                }}
                className="mt-6 px-8 py-3 bg-boutique-black-matte text-white rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors"
              >
                Limpiar filtros
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrdersPage;
