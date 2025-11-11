import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SellerHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-boutique-rose-light via-white to-boutique-beige">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-raleway text-2xl font-bold text-boutique-black-matte">
              💼 Panel de Vendedor
            </h1>
            <p className="font-poppins text-sm text-gray-600">
              Bienvenida, {user?.first_name} {user?.last_name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-poppins text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* Dashboard Cards */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-poppins text-sm text-gray-600">Ventas</p>
                <p className="font-raleway text-2xl font-bold">--</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="font-poppins text-sm text-gray-600">Productos</p>
                <p className="font-raleway text-2xl font-bold">--</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-poppins text-sm text-gray-600">Ingresos</p>
                <p className="font-raleway text-2xl font-bold">$--</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md p-8"
        >
          <h2 className="font-raleway text-xl font-bold text-boutique-black-matte mb-4">
            Panel de Vendedor
          </h2>
          <p className="font-poppins text-gray-600 mb-6">
            Esta es la vista de vendedor. Aquí podrás gestionar tus ventas, productos en inventario y ver estadísticas de rendimiento.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="font-poppins text-sm text-purple-800">
              <strong>Rol:</strong> {user?.role} | <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerHome;
