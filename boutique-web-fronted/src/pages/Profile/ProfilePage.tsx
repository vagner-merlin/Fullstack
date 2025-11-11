import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '../../components/layout/PublicLayout';
import EditProfileForm from '../../components/profile/EditProfileForm';
import AddressesList from '../../components/profile/AddressesList';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setChangingPassword(true);
    setPasswordMessage(null);

    try {
      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordMessage({ type: 'success', text: '¡Contraseña actualizada correctamente!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setPasswordMessage(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar contraseña';
      setPasswordMessage({ type: 'error', text: errorMessage });
    } finally {
      setChangingPassword(false);
    }
  };

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

              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-boutique-rose-light to-boutique-beige rounded-full">
                  <UserCircle size={32} className="text-boutique-black-matte" />
                </div>
                <div>
                  <h1 className="font-raleway text-4xl md:text-5xl font-bold text-boutique-black-matte">
                    Mi Perfil
                  </h1>
                  {user && (
                    <p className="font-poppins text-gray-600 text-lg mt-1">
                      {user.first_name} {user.last_name}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Tabs */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-4 sticky top-24"
              >
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-poppins font-semibold transition-all ${
                      activeTab === 'profile'
                        ? 'bg-boutique-black-matte text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <UserCircle size={20} />
                    Datos Personales
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-poppins font-semibold transition-all ${
                      activeTab === 'addresses'
                        ? 'bg-boutique-black-matte text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft size={20} className="rotate-180" />
                    Mis Direcciones
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-poppins font-semibold transition-all ${
                      activeTab === 'security'
                        ? 'bg-boutique-black-matte text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Lock size={20} />
                    Seguridad
                  </button>
                </nav>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'profile' && (
                <EditProfileForm onUpdate={updateUser} />
              )}

              {activeTab === 'addresses' && (
                <AddressesList />
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-boutique-rose-light to-boutique-beige rounded-lg">
                      <Lock size={24} className="text-boutique-black-matte" />
                    </div>
                    <h2 className="font-raleway text-2xl font-bold text-boutique-black-matte">
                      Cambiar Contraseña
                    </h2>
                  </div>

                  {passwordMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-6 p-4 rounded-lg ${
                        passwordMessage.type === 'success'
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}
                    >
                      <p className="font-poppins text-sm">{passwordMessage.text}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                        Contraseña Actual *
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                        Nueva Contraseña *
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                        placeholder="••••••••"
                      />
                      <p className="font-poppins text-xs text-gray-500 mt-1">
                        Mínimo 6 caracteres
                      </p>
                    </div>

                    <div>
                      <label className="block font-poppins text-sm font-semibold text-gray-700 mb-2">
                        Confirmar Nueva Contraseña *
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg font-poppins focus:ring-2 focus:ring-boutique-rose focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="w-full bg-boutique-black-matte text-white py-4 rounded-lg font-poppins font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {changingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                  </form>

                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-poppins font-semibold text-sm text-blue-900 mb-2">
                      Consejos de seguridad
                    </h3>
                    <ul className="font-poppins text-xs text-blue-800 space-y-1">
                      <li>• Usa una contraseña única que no uses en otros sitios</li>
                      <li>• Combina letras mayúsculas, minúsculas, números y símbolos</li>
                      <li>• No compartas tu contraseña con nadie</li>
                      <li>• Cambia tu contraseña regularmente</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProfilePage;
