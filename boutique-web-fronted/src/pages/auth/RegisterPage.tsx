import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    emailPrefix: '', // Solo el nombre de usuario antes de @
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (!formData.emailPrefix.trim()) {
      setError('El nombre de usuario del email es requerido');
      return;
    }

    if (formData.emailPrefix.includes('@') || formData.emailPrefix.includes(' ')) {
      setError('El nombre de usuario no debe contener @ ni espacios');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }    setIsLoading(true);

    try {
      // Construir el email completo con @gmail.cli fijo
      const fullEmail = `${formData.emailPrefix}@gmail.cli`;
      
      await register({
        username: formData.username,
        email: fullEmail,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      setSuccess(true);
      
      // Redirigir a completar perfil después de 2 segundos
      setTimeout(() => {
        navigate('/auth/complete-profile', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-boutique-beige via-white to-boutique-rose-light flex items-center justify-center py-12 px-4">
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

        {/* Logo and Header */}
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
            Crear Cuenta
          </h1>
          <p className="font-poppins text-gray-600">
            Únete a nuestra comunidad
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          {success ? (
            /* Success Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte mb-3">
                ¡Cuenta creada exitosamente!
              </h2>
              <p className="font-poppins text-gray-600 mb-2">
                Bienvenida a THEBUTIK
              </p>
              <p className="font-poppins text-sm text-gray-500">
                Redirigiendo a la tienda...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Username Field */}
              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="juanperez123"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                  />
                </div>
              </div>

              {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Juan"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Pérez"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <div className="flex">
                  <input
                    type="text"
                    required
                    value={formData.emailPrefix}
                    onChange={(e) => setFormData({ ...formData, emailPrefix: e.target.value })}
                    placeholder="nombre"
                    className="flex-1 pl-10 pr-2 py-2.5 border border-gray-300 rounded-l-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                  />
                  <div className="px-3 py-2.5 bg-gray-100 border-t border-r border-b border-gray-300 rounded-r-xl flex items-center font-poppins text-sm text-gray-600">
                    @gmail.cli
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Solo escribe tu nombre de usuario. El dominio @gmail.cli se agregará automáticamente
              </p>
              {formData.emailPrefix && (
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  Tu email será: <span className="bg-blue-50 px-2 py-0.5 rounded">{formData.emailPrefix}@gmail.cli</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-2">
              <input type="checkbox" required className="mt-1 rounded border-gray-300" />
              <span className="font-poppins text-xs text-gray-600">
                Acepto los{' '}
                <Link to="/terms" className="text-boutique-black-matte hover:underline">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link to="/privacy" className="text-boutique-black-matte hover:underline">
                  Política de Privacidad
                </Link>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-boutique-black-matte text-white py-3 rounded-xl font-poppins font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
          )}

          {/* Sign In Link */}
          {!success && (
            <p className="text-center font-poppins text-sm text-gray-600 mt-6">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/auth/login" className="text-boutique-black-matte font-semibold hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
