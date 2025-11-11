import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Save, Loader, User as UserIcon } from 'lucide-react';
import userService, { type UpdateUserData } from '../../services/userService';
import type { User } from '../../context/AuthContext';

interface EditProfileFormProps {
  onUpdate?: (user: User) => void;
}

const EditProfileForm = ({ onUpdate }: EditProfileFormProps) => {
  const [formData, setFormData] = useState<UpdateUserData>({
    first_name: '',
    last_name: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: undefined,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await userService.getMe();
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        telefono: user.telefono || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
        genero: user.genero,
      });
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setMessage({ type: 'error', text: 'Error al cargar tus datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updatedUser = await userService.updateMe(formData);
      setMessage({ type: 'success', text: '¡Datos actualizados correctamente!' });
      
      if (onUpdate) {
        onUpdate(updatedUser);
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error al actualizar datos:', error);
      setMessage({ type: 'error', text: 'Error al actualizar. Intenta nuevamente.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-boutique-black-matte"></div>
        <p className="font-poppins text-gray-600 mt-4">Cargando datos...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-boutique-rose-light to-boutique-beige rounded-lg">
          <UserIcon size={24} className="text-boutique-black-matte" />
        </div>
        <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte">
          Datos Personales
        </h2>
      </div>

      {/* Mensaje de éxito/error */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <p className="font-poppins text-sm">{message.text}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="first_name" className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
            placeholder="Tu nombre"
          />
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="last_name" className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Apellido *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
            placeholder="Tu apellido"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Correo Electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
            placeholder="tu@email.com"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
            placeholder="+591 70000000"
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label htmlFor="fecha_nacimiento" className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
          />
        </div>

        {/* Género */}
        <div>
          <label htmlFor="genero" className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
            Género
          </label>
          <select
            id="genero"
            name="genero"
            value={formData.genero || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent transition-all"
          >
            <option value="">Seleccionar...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-boutique-black-matte text-white py-4 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader size={20} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={20} />
              Guardar Cambios
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default EditProfileForm;
