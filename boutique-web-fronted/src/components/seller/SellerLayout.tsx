import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ShoppingCart, 
  BarChart3,
  Menu, 
  X,
  LogOut,
  ChevronRight,
  Store
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SellerLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/seller/home', icon: Home, label: 'Inicio' },
  { path: '/seller/pos', icon: ShoppingCart, label: 'Punto de Venta' },
  { path: '/seller/sales', icon: BarChart3, label: 'Mis Ventas' },
];

export const SellerLayout = ({ children }: SellerLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-2xl"
          >
            {/* Header Sidebar */}
            <div className="p-6 border-b border-indigo-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Store className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">POS Vendedor</h2>
                    <p className="text-indigo-100 text-sm mt-1">Punto de Venta</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-indigo-500/30 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-indigo-500">
              <div className="flex items-center gap-3 p-3 bg-indigo-500/30 rounded-lg">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Store className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user?.email || 'Vendedor'}
                  </p>
                  <p className="text-xs text-indigo-100 truncate">Vendedor</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-lg font-semibold'
                        : 'text-white hover:bg-indigo-500/30'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-indigo-500">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 transition-all text-white"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Vendedor'}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Links rápidos */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Link to="/" className="px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                Ver Tienda
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2024 Boutique - Sistema POS para Vendedores
            </p>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
