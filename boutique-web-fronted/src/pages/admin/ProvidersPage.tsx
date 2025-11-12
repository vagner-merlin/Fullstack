import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { showToast } from '../../utils/toast';
import type { Provider, CreateProviderData } from '../../services/admin/providerService';
import { 
  getAllProviders, 
  createProvider, 
  updateProvider, 
  deleteProvider,
  searchProviders
} from '../../services/admin/providerService';

export const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState<CreateProviderData>({
    nombre: '',
    nombre_contacto: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, providers]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await getAllProviders();
      setProviders(data);
      setFilteredProviders(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      showToast.error('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        setFilteredProviders(providers);
        return;
      }
      const results = await searchProviders(searchTerm);
      setFilteredProviders(results);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.email.trim()) {
      showToast.error('Nombre y email son obligatorios');
      return;
    }

    try {
      if (editingProvider) {
        await updateProvider(editingProvider.id, formData);
        showToast.success('Proveedor actualizado correctamente');
      } else {
        await createProvider(formData);
        showToast.success('Proveedor creado correctamente');
      }

      loadProviders();
      closeModal();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      showToast.error('Error al guardar proveedor');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return;

    try {
      await deleteProvider(id);
      showToast.success('Proveedor eliminado correctamente');
      loadProviders();
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      showToast.error('Error al eliminar proveedor');
    }
  };

  const openCreateModal = () => {
    setEditingProvider(null);
    setFormData({
      nombre: '',
      nombre_contacto: '',
      email: '',
      telefono: '',
      direccion: ''
    });
    setShowModal(true);
  };

  const openEditModal = (provider: Provider) => {
    setEditingProvider(provider);
    setFormData({
      nombre: provider.nombre,
      nombre_contacto: provider.nombre_contacto,
      email: provider.email,
      telefono: provider.telefono,
      direccion: provider.direccion
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProvider(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Proveedores</h2>
          <p className="text-gray-600 mt-1">Gestiona los proveedores del boutique</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Proveedores</p>
              <p className="text-3xl font-bold mt-2">{providers.length}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Truck className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Con Email</p>
              <p className="text-3xl font-bold mt-2">
                {providers.filter(p => p.email).length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Mail className="h-8 w-8" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Con Teléfono</p>
              <p className="text-3xl font-bold mt-2">
                {providers.filter(p => p.telefono).length}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Phone className="h-8 w-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar proveedores..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProviders.map((provider) => (
                <motion.tr
                  key={provider.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                        {provider.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{provider.nombre}</div>
                        {provider.direccion && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {provider.direccion}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {provider.nombre_contacto || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {provider.email || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {provider.telefono || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(provider)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar proveedor"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(provider.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar proveedor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron proveedores</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    placeholder="Nombre de la empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persona de Contacto *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_contacto}
                    onChange={(e) => setFormData({ ...formData, nombre_contacto: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    placeholder="Nombre del contacto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    placeholder="+591 12345678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <textarea
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    rows={3}
                    required
                    placeholder="Dirección completa del proveedor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingProvider ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
