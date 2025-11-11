import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    telefono: '',
    fecha_nacimiento: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Si no hay sesión, redirigir a login
    if (!user || !token) {
      setError('No hay sesión activa. Por favor inicia sesión nuevamente.');
      setTimeout(() => navigate('/auth/login', { replace: true }), 2000);
      return;
    }

    // Validaciones
    if (!formData.telefono || formData.telefono.trim() === '') {
      setError('El teléfono es requerido');
      return;
    }

    if (!formData.fecha_nacimiento || formData.fecha_nacimiento.trim() === '') {
      setError('La fecha de nacimiento es requerida');
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const payload = {
        telefono: formData.telefono.trim(),
        fecha_nacimiento: formData.fecha_nacimiento,
        usuario: user.id,
      };
      
      // Crear registro de Cliente en Django
      const response = await fetch(`${API_URL}/api/clientes/clientes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Manejar errores específicos
        let errorMessage = 'Error al guardar los datos';
        
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.telefono) {
          errorMessage = `Teléfono: ${responseData.telefono[0]}`;
        } else if (responseData.fecha_nacimiento) {
          errorMessage = `Fecha de nacimiento: ${responseData.fecha_nacimiento[0]}`;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
        
        setError(errorMessage);
        return;
      }

      // ✅ Éxito
      setSuccess(true);
      
      // Redirigir a la tienda después de 1.5 segundos
      setTimeout(() => {
        navigate('/shop', { replace: true });
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión con el servidor');
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
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
          </div>
          <h1 className="font-raleway text-3xl font-bold text-boutique-black-matte mb-2">
            Completa tu Perfil
          </h1>
          <p className="font-poppins text-gray-600">
            Solo faltan un par de datos más
          </p>
        </div>

        {/* Form Card */}
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
                ¡Perfil completado!
              </h2>
              <p className="font-poppins text-gray-600 mb-2">
                Tus datos se guardaron correctamente
              </p>
              <p className="font-poppins text-sm text-gray-500">
                Redirigiendo a tu perfil...
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
                  {error.includes('servidor') && (
                    <p className="font-poppins text-xs text-red-600 mt-2">
                      💡 Tip: Puedes "Completar después" e ir directo a tu perfil
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Phone Field */}
            <div>
              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="+591 12345678"
                  maxLength={15}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 font-poppins">
                Máximo 15 caracteres
              </p>
            </div>

            {/* Birth Date Field */}
            <div>
              <label className="block font-poppins text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  required
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                  max={new Date().toISOString().split('T')[0]} // No fechas futuras
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl font-poppins text-sm focus:outline-none focus:border-boutique-black-matte transition-colors"
                />
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-poppins text-sm text-blue-800">
                💡 Estos datos nos ayudan a brindarte una mejor experiencia de compra
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-boutique-black-matte text-white py-3 rounded-xl font-poppins font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Guardando...' : 'Continuar'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteProfilePage;
