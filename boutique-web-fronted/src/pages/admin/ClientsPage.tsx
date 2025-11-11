import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag, TrendingUp } from 'lucide-react';
import type { UserBase, OrderBase } from '../../types/common';

interface Client {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  total_compras: number;
  monto_total_gastado: number;
  fecha_registro: string;
  ultima_compra?: string;
}

export const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    try {
      setLoading(true);
      // Cargar clientes desde localStorage (simulado)
      const users: UserBase[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Filtrar solo usuarios con rol cliente
      const clientUsers = users.filter((u) => u.role === 'cliente');
      
      // Cargar pedidos para calcular estadísticas
      const orders: OrderBase[] = JSON.parse(localStorage.getItem('orders') || '[]');
      
      const clientsData: Client[] = clientUsers.map((user) => {
        // Filtrar pedidos de este cliente
        const userOrders = orders.filter((o) => o.user_email === user.email);
        const totalCompras = userOrders.length;
        const montoTotal = userOrders.reduce((sum: number, o) => sum + (o.total || 0), 0);
        const ultimaCompra = userOrders.length > 0 
          ? userOrders.sort((a, b) => 
              new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
            )[0].fecha_creacion
          : undefined;

        return {
          id: user.id,
          nombre: user.first_name || 'N/A',
          apellido: user.last_name || '',
          email: user.email,
          telefono: user.telefono,
          total_compras: totalCompras,
          monto_total_gastado: montoTotal,
          fecha_registro: user.created_at || new Date().toISOString(),
          ultima_compra: ultimaCompra
        };
      });

      setClients(clientsData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClientes = clients.length;
  const clientesActivos = clients.filter(c => c.total_compras > 0).length;
  const clientesNuevos = clients.filter(c => {
    const registro = new Date(c.fecha_registro);
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
              <p className="text-green-100 text-xs mt-1">Con compras realizadas</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-green-200" />
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
            <TrendingUp className="h-12 w-12 text-purple-200" />
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
            placeholder="Buscar por nombre o email..."
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
                  Compras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gastado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold">
                        {client.nombre.charAt(0)}{client.apellido.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {client.nombre} {client.apellido}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {client.email}
                      </div>
                      {client.telefono && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {client.telefono}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900">{client.total_compras}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-green-600">
                      Bs {client.monto_total_gastado.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.ultima_compra ? (
                      <div className="text-sm text-gray-600">
                        {new Date(client.ultima_compra).toLocaleDateString('es-ES')}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin compras</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(client.fecha_registro).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron clientes</p>
          </div>
        )}
      </div>
    </div>
  );
};
