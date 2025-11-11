import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  getDashboardStats,
  getWeeklySales,
  getTopProducts,
  type DashboardStats,
  type SalesData,
  type TopProduct
} from '../../services/admin/dashboardService';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: typeof TrendingUp; 
  color: string;
  trend?: { value: number; isPositive: boolean };
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
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, weekSales, products] = await Promise.all([
          getDashboardStats(),
          getWeeklySales(),
          getTopProducts(5)
        ]);
        setStats(statsData);
        setSalesData(weekSales);
        setTopProducts(products);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Resumen general de tu boutique</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas del Mes"
          value={stats.ventas_mes_actual}
          icon={ShoppingCart}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`Bs ${stats.ingresos_mes_actual.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Productos Totales"
          value={stats.productos_totales}
          icon={Package}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Pedidos Pendientes"
          value={stats.pedidos_pendientes}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clientes"
          value={stats.clientes_totales}
          icon={Users}
          color="bg-gradient-to-br from-pink-500 to-pink-600"
        />
        <StatCard
          title="Ingresos Totales"
          value={`Bs ${stats.ingresos_totales.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.productos_stock_bajo}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
        <StatCard
          title="Total Ventas"
          value={stats.ventas_totales}
          icon={ShoppingCart}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ventas Semanales */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ventas de la Semana</h3>
          <div className="space-y-3">
            {salesData.map((day, idx) => {
              const date = new Date(day.fecha);
              const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
              const maxVentas = Math.max(...salesData.map(d => d.ventas), 1);
              const percentage = (day.ventas / maxVentas) * 100;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 capitalize">{dayName}</span>
                    <span className="text-gray-600">{day.ventas} ventas</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Bs {day.ingresos.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Productos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Productos Más Vendidos</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.nombre}</p>
                    <p className="text-sm text-gray-500">{product.ventas} unidades vendidas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">Bs {product.ingresos.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay ventas registradas</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Alertas */}
      {stats.productos_stock_bajo > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-orange-900">Productos con Stock Bajo</h4>
              <p className="text-orange-700 mt-1">
                Hay {stats.productos_stock_bajo} producto(s) que necesitan reabastecimiento.
              </p>
              <a 
                href="/admin/inventory" 
                className="inline-flex items-center gap-2 mt-3 text-orange-600 hover:text-orange-700 font-medium"
              >
                Ver Inventario
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
