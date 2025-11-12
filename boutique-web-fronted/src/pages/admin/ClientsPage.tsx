import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, Calendar, UserCheck, UserX, Trash2, Shield } from 'lucide-react';
import { getAllClients, toggleClientActive, deleteClient, type Client } from '../../services/admin/clientService';
import { showToast } from '../../utils/toast';

export const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      showToast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (clientId: number) => {
    try {
      setProcessingId(clientId);
      const updatedClient = await toggleClientActive(clientId);
      setClients(clients.map(c => c.id === clientId ? updatedClient : c));
      showToast.success(
        `Cliente ${updatedClient.usuario_activo ? 'activado' : 'desactivado'} exitosamente`
      );
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showToast.error('Error al cambiar estado del cliente');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (clientId: number, clientName: string) => {
    if (!window.confirm(
      `¿Estás seguro de eliminar al cliente "${clientName}"?\n\n` +
      `⚠️ ADVERTENCIA: Esto también eliminará su cuenta de usuario asociada. Esta acción no se puede deshacer.`
    )) {
      return;
    }

    try {
      setProcessingId(clientId);
      await deleteClient(clientId);
      setClients(clients.filter(c => c.id !== clientId));
      showToast.success('Cliente y usuario eliminados exitosamente');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      showToast.error('Error al eliminar cliente');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredClients = clients.filter(client =>
    client.usuario_nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.usuario_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telefono.includes(searchTerm) ||
    client.usuario_info.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClientes = clients.length;
  const clientesActivos = clients.filter(c => c.usuario_activo).length;
  const clientesNuevos = clients.filter(c => {
    const registro = new Date(c.fecha_creacion);
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    return registro >= hace30Dias;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h2>
        <p className="text-gray-600 mt-2">Todos los clientes registrados en tu boutique</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Clientes</p>
              <p className="text-4xl font-bold mt-2">{totalClientes}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Clientes Activos</p>
              <p className="text-4xl font-bold mt-2">{clientesActivos}</p>
              <p className="text-green-100 text-xs mt-1">Con cuentas activadas</p>
            </div>
            <UserCheck className="h-12 w-12 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Nuevos (30 días)</p>
              <p className="text-4xl font-bold mt-2">{clientesNuevos}</p>
            </div>
            <Calendar className="h-12 w-12 text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono o usuario..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => {
                const isProcessing = processingId === client.id;
                const nombres = client.usuario_nombre_completo.split(' ');
                const iniciales = nombres.length >= 2 
                  ? `${nombres[0].charAt(0)}${nombres[1].charAt(0)}`
                  : client.usuario_nombre_completo.substring(0, 2).toUpperCase();
                
                return (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold">
                          {iniciales}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {client.usuario_nombre_completo}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {client.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {client.usuario_email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {client.telefono}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 font-mono">
                          {client.usuario_info.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.usuario_activo ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <UserCheck className="h-3 w-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <UserX className="h-3 w-3" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(client.fecha_creacion).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(client.id)}
                          disabled={isProcessing}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            client.usuario_activo
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={client.usuario_activo ? 'Desactivar cuenta' : 'Activar cuenta'}
                        >
                          {isProcessing ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          ) : client.usuario_activo ? (
                            <>
                              <UserX className="h-4 w-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" />
                              Activar
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(client.id, client.usuario_nombre_completo)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar cliente y usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron clientes</p>
          </div>
        )}
      </div>
    </div>
  );
};
