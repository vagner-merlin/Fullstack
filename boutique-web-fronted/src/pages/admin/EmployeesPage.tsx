import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Trash2, Search, Mail, Shield, Calendar, UserCheck, UserX, FolderPlus } from 'lucide-react';
import { showToast } from '../../utils/toast';
import {
  getAllGroups,
  createGroup,
  deleteGroup,
  getAllEmployees,
  createEmployee,
  toggleEmployeeActive,
  deleteEmployee,
  type Group,
  type Employee,
  type CreateEmployeeData
} from '../../services/admin/employeeService';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateEmployeeData>({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    group_id: 0,
    is_staff: false
  });
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesData, groupsData] = await Promise.all([
        getAllEmployees(),
        getAllGroups()
      ]);
      setEmployees(employeesData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showToast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup(groupName);
      showToast.success('Grupo creado exitosamente');
      setGroupName('');
      setShowGroupModal(false);
      loadData();
    } catch (error: any) {
      console.error('Error al crear grupo:', error);
      const errorMsg = error.response?.data?.errors?.name?.[0] || 'Error al crear grupo';
      showToast.error(errorMsg);
    }
  };

  const handleDeleteGroup = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar el grupo "${name}"? Los empleados no serán eliminados.`)) return;
    try {
      await deleteGroup(id);
      showToast.success('Grupo eliminado exitosamente');
      loadData();
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      showToast.error('Error al eliminar grupo');
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.group_id === 0) {
      showToast.error('Debes seleccionar un grupo');
      return;
    }
    try {
      await createEmployee(formData);
      showToast.success('Empleado creado exitosamente');
      resetForm();
      setShowEmployeeModal(false);
      loadData();
    } catch (error: any) {
      console.error('Error al crear empleado:', error);
      const errors = error.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join(', ');
        showToast.error(errorMessages as string);
      } else {
        showToast.error('Error al crear empleado');
      }
    }
  };

  const handleToggleActive = async (userId: number) => {
    try {
      setProcessingId(userId);
      const updated = await toggleEmployeeActive(userId);
      setEmployees(employees.map(e => e.id === userId ? updated : e));
      showToast.success(`Empleado ${updated.is_active ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showToast.error('Error al cambiar estado del empleado');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteEmployee = async (userId: number, name: string) => {
    if (!confirm(`¿Eliminar al empleado "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      setProcessingId(userId);
      await deleteEmployee(userId);
      setEmployees(employees.filter(e => e.id !== userId));
      showToast.success('Empleado eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      showToast.error('Error al eliminar empleado');
    } finally {
      setProcessingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      group_id: 0,
      is_staff: false
    });
  };

  const filteredEmployees = employees.filter(emp =>
    emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.group_names.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Empleados y Grupos</h2>
          <p className="text-gray-600 mt-2">Administra tu equipo y grupos de trabajo</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGroupModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800"
          >
            <FolderPlus className="h-5 w-5" />
            Nuevo Grupo
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmployeeModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800"
          >
            <Plus className="h-5 w-5" />
            Nuevo Empleado
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Empleados</p>
              <p className="text-4xl font-bold mt-2">{totalEmployees}</p>
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
              <p className="text-green-100 text-sm font-medium">Empleados Activos</p>
              <p className="text-4xl font-bold mt-2">{activeEmployees}</p>
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
              <p className="text-purple-100 text-sm font-medium">Grupos</p>
              <p className="text-4xl font-bold mt-2">{groups.length}</p>
            </div>
            <Shield className="h-12 w-12 text-purple-200" />
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Grupos Disponibles</h3>
        <div className="flex flex-wrap gap-3">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg border border-purple-200"
            >
              <Shield className="h-4 w-4" />
              <span className="font-medium">{group.name}</span>
              <span className="text-xs text-purple-600">({group.users_count || 0} usuarios)</span>
              <button
                onClick={() => handleDeleteGroup(group.id, group.name)}
                className="ml-2 text-red-600 hover:text-red-800"
                title="Eliminar grupo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
          {groups.length === 0 && (
            <p className="text-gray-500 text-sm">No hay grupos creados. Crea uno para asignar empleados.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email, usuario o grupo..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupos
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
              {filteredEmployees.map((employee) => {
                const isProcessing = processingId === employee.id;
                const fullName = `${employee.first_name} ${employee.last_name}`.trim() || employee.username;
                const initials = employee.first_name && employee.last_name
                  ? `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`
                  : employee.username.substring(0, 2).toUpperCase();

                return (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{fullName}</div>
                          {employee.is_staff && (
                            <span className="text-xs text-purple-600 font-medium">Staff</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">{employee.username}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {employee.group_names.map((groupName, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded"
                          >
                            {groupName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.is_active ? (
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
                        {new Date(employee.date_joined).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(employee.id)}
                          disabled={isProcessing}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            employee.is_active
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isProcessing ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          ) : employee.is_active ? (
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
                          onClick={() => handleDeleteEmployee(employee.id, fullName)}
                          disabled={isProcessing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron empleados</p>
          </div>
        )}
      </div>

      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Grupo</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Grupo
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ej: vendedores, administradores, cajeros"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este grupo se usará para asignar empleados y permisos
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowGroupModal(false);
                    setGroupName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors"
                >
                  Crear Grupo
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Crear Nuevo Empleado</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo *
                </label>
                <select
                  value={formData.group_id}
                  onChange={(e) => setFormData({ ...formData, group_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                >
                  <option value={0}>Seleccionar grupo...</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {groups.length === 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Debes crear un grupo primero
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_staff"
                  checked={formData.is_staff}
                  onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                  className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="is_staff" className="text-sm text-gray-700">
                  Acceso al panel de administración de Django (Solo Staff)
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Nota: Esta opción solo otorga acceso como staff, NO como superusuario
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmployeeModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={groups.length === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Empleado
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
