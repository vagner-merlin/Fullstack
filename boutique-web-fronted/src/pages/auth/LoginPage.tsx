import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Función para determinar la ruta según el rol
  const getRedirectPath = (role: UserRole): string => {
    switch (role) {
      case 'client':
        return '/shop';
      case 'seller':
        return '/seller/home';
      case 'admin':
      case 'superadmin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const redirectTo = await login(formData.email, formData.password);
      
      // Redirigir automáticamente según el tipo de usuario determinado por el backend
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        // Fallback en caso de que no haya redirect_to
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const redirectPath = getRedirectPath(user.role);
          navigate(redirectPath, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-boutique-rose-light via-white to-boutique-beige flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-boutique-black-matte mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-poppins text-sm">Volver</span>
        </button>

        {/* Logo and Back Link */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 4L4 10L16 16L28 10L16 4Z"
                    fill="#E5C5B5"
                    stroke="#1A1A1A"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 16L16 22L28 16"
                    stroke="#1A1A1A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 22L16 28L28 22"
                    stroke="#1A1A1A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-raleway text-xl font-semibold text-boutique-black-matte tracking-wide">
                THEBUTIK
              </span>
            </div>
          </Link>
          <h1 className="font-raleway text-3xl font-bold text-boutique-black-matte mb-2">
            Bienvenida de nuevo
          </h1>
          <p className="font-poppins text-gray-600">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-poppins text-sm text-red-800">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:border-boutique-black-matte transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl font-poppins focus:outline-none focus:border-boutique-black-matte transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="font-poppins text-gray-600">Recordarme</span>
              </label>
              <Link to="/auth/forgot-password" className="font-poppins text-boutique-black-matte hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-boutique-black-matte text-white py-3 rounded-xl font-poppins font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white font-poppins text-gray-500">O continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xl">📘</span>
              <span className="font-poppins text-sm font-medium">Facebook</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-xl">🔍</span>
              <span className="font-poppins text-sm font-medium">Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center font-poppins text-sm text-gray-600 mt-6">
            ¿No tienes una cuenta?{' '}
            <Link to="/auth/register" className="text-boutique-black-matte font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
