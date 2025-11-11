import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  Clock
} from 'lucide-react';
import {
  getDailySalesStats,
  getTodaySellerSales,
  type DailySalesStats,
  type PosSale
} from '../../services/seller/posService';
import { useAuth } from '../../hooks/useAuth';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  subtitle
}: { 
  title: string; 
  value: string | number; 
  icon: typeof TrendingUp; 
  color: string;
  subtitle?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export const SellerHomePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DailySalesStats | null>(null);
  const [recentSales, setRecentSales] = useState<PosSale[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    try {
      setLoading(true);
      const statsData = getDailySalesStats(user?.id);
      const sales = getTodaySellerSales(user?.id || 0);
      
      setStats(statsData);
      setRecentSales(sales.slice(0, 5)); // Últimas 5 ventas
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
    // Recargar cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            ¡Hola, {user?.first_name || 'Vendedor'}!
          </h2>
          <p className="text-gray-600 mt-2">Resumen de ventas del día</p>
        </div>
        <Link
          to="/seller/pos"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <ShoppingBag className="h-5 w-5" />
          Ir a Punto de Venta
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ventas de Hoy"
            value={stats.ventas_completadas}
            icon={ShoppingBag}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            subtitle={`${stats.ventas_canceladas} canceladas`}
          />
          <StatCard
            title="Ingresos de Hoy"
            value={`Bs ${stats.total_ingresos.toFixed(2)}`}
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Venta Promedio"
            value={`Bs ${stats.venta_promedio.toFixed(2)}`}
            icon={TrendingUp}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Transacciones"
            value={stats.total_ventas}
            icon={CreditCard}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>
      )}

      {/* Métodos de Pago */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Métodos de Pago Utilizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <Banknote className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Efectivo</p>
                <p className="text-2xl font-bold text-gray-900">{stats.metodos_pago.efectivo}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tarjeta</p>
                <p className="text-2xl font-bold text-gray-900">{stats.metodos_pago.tarjeta}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <Smartphone className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">QR</p>
                <p className="text-2xl font-bold text-gray-900">{stats.metodos_pago.qr}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ventas Recientes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Ventas Recientes</h3>
        </div>
        
        {recentSales.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentSales.map((sale) => {
              const saleTime = new Date(sale.created_at);
              const timeAgo = Math.floor((Date.now() - saleTime.getTime()) / 1000 / 60); // minutos
              
              return (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">{sale.numero_venta}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          sale.estado === 'completado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sale.estado === 'completado' ? 'Completado' : 'Cancelado'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{sale.items.length} producto(s)</span>
                        <span>•</span>
                        <span className="capitalize">{sale.metodo_pago}</span>
                        {sale.cliente_nombre && (
                          <>
                            <span>•</span>
                            <span>{sale.cliente_nombre}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {timeAgo < 1 ? 'Hace un momento' : `Hace ${timeAgo} min`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        Bs {sale.total.toFixed(2)}
                      </p>
                      {sale.descuento_total > 0 && (
                        <p className="text-xs text-gray-500">
                          Desc: Bs {sale.descuento_total.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No hay ventas registradas hoy</p>
            <Link
              to="/seller/pos"
              className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Registrar primera venta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
