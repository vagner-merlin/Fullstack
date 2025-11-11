import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Key, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/toast';
import type { UserBase } from '../../types/common';

export const ProfilePageAdmin = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    localStorage.getItem(`profile_image_${user?.id}`) || ''
  );
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    direccion: user?.direccion || '',
    ciudad: user?.ciudad || '',
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB max
        showToast.error('La imagen no debe superar 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        localStorage.setItem(`profile_image_${user?.id}`, imageData);
        showToast.success('Foto de perfil actualizada');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    try {
      const users: UserBase[] = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u) => {
        if (u.id === user?.id) {
          return {
            ...u,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            telefono: formData.telefono,
            direccion: formData.direccion,
            ciudad: formData.ciudad,
          };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Actualizar también currentUser
      const updatedCurrentUser = updatedUsers.find((u) => u.id === user?.id);
      if (updatedCurrentUser) {
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      }

      showToast.success('Perfil actualizado correctamente');
      setIsEditing(false);
      
      // Recargar página para reflejar cambios
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      showToast.error('Error al actualizar perfil');
    }
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      showToast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.new.length < 6) {
      showToast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      const users: UserBase[] = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUserData = users.find((u) => u.id === user?.id);

      if (currentUserData?.password !== passwordData.current) {
        showToast.error('Contraseña actual incorrecta');
        return;
      }

      const updatedUsers = users.map((u) => {
        if (u.id === user?.id) {
          return { ...u, password: passwordData.new };
        }
        return u;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      showToast.success('Contraseña actualizada correctamente');
      setShowPasswordModal(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      showToast.error('Error al cambiar contraseña');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mi Perfil</h2>
        <p className="text-gray-600 mt-2">Administra tu información personal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Foto de Perfil */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Foto de Perfil</h3>
            
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Perfil"
                    className="w-40 h-40 rounded-full object-cover border-4 border-rose-500"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-rose-500">
                    {formData.first_name.charAt(0)}{formData.last_name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-10 w-10 text-white" />
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                onClick={handleImageClick}
                className="mt-4 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Cambiar Foto
              </button>

              <div className="mt-6 w-full space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="h-4 w-4 text-rose-500" />
                  <span className="font-semibold">Rol:</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {user?.role === 'admin' ? 'Administrador' : user?.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-rose-500" />
                  <span className="font-semibold">Miembro desde:</span>
                  <span>{new Date(user?.created_at || Date.now()).toLocaleDateString('es-ES')}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors flex items-center justify-center gap-2"
              >
                <Key className="h-4 w-4" />
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </motion.div>

        {/* Información Personal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                >
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        first_name: user?.first_name || '',
                        last_name: user?.last_name || '',
                        email: user?.email || '',
                        telefono: user?.telefono || '',
                        direccion: user?.direccion || '',
                        ciudad: user?.ciudad || '',
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Guardar
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-rose-500" />
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-rose-500" />
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 text-rose-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 text-rose-500" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Ej: 70123456"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Ej: Cochabamba"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Ej: Av. Heroínas #123"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal Cambiar Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Key className="h-6 w-6 text-rose-600" />
              Cambiar Contraseña
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
