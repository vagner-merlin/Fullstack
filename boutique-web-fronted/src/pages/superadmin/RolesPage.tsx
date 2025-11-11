import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Crown, Store, User, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ROLES_CONFIG,
  getPermissionsByCategory,
  getRoleStats,
  type UserRole
} from '../../services/superadmin/roleService';

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'superadmin': return Crown;
    case 'admin': return Shield;
    case 'seller': return Store;
    default: return User;
  }
};

export const RolesPage = () => {
  const [expandedRole, setExpandedRole] = useState<UserRole | null>('superadmin');
  const permissionsByCategory = getPermissionsByCategory();
  const roleStats = getRoleStats();

  const toggleRole = (role: UserRole) => {
    setExpandedRole(expandedRole === role ? null : role);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Roles y Permisos</h2>
        <p className="text-gray-600 mt-2">Sistema de control de acceso basado en roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roleStats.map((stat) => {
          const RoleIcon = getRoleIcon(stat.role);
          const config = ROLES_CONFIG.find(r => r.role === stat.role);

          return (
            <div
              key={stat.role}
              className={`bg-gradient-to-br from-${config?.color}-50 to-white rounded-lg shadow-sm p-6 border-2 border-${config?.color}-200`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-${config?.color}-100`}>
                  <RoleIcon className={`h-6 w-6 text-${config?.color}-700`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{config?.name}</h3>
                  <p className="text-sm text-gray-600">{stat.permissions_count} permisos</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{config?.description}</p>
            </div>
          );
        })}
      </div>

      {/* Roles Cards */}
      <div className="space-y-4">
        {ROLES_CONFIG.map((roleConfig) => {
          const RoleIcon = getRoleIcon(roleConfig.role);
          const isExpanded = expandedRole === roleConfig.role;

          return (
            <motion.div
              key={roleConfig.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-2 border-${roleConfig.color}-200`}
            >
              {/* Role Header */}
              <button
                onClick={() => toggleRole(roleConfig.role)}
                className={`w-full p-6 flex items-center justify-between bg-gradient-to-r from-${roleConfig.color}-50 to-white hover:from-${roleConfig.color}-100 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-${roleConfig.color}-100`}>
                    <RoleIcon className={`h-8 w-8 text-${roleConfig.color}-700`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900">{roleConfig.name}</h3>
                    <p className="text-gray-600 mt-1">{roleConfig.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-sm font-medium text-${roleConfig.color}-700`}>
                        {roleConfig.permissions.length} Permisos
                      </span>
                      <span className="text-sm text-gray-500">
                        {roleConfig.routes.length} Rutas
                      </span>
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200"
                >
                  {/* Permissions by Category */}
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Permisos</h4>
                      <div className="space-y-4">
                        {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                          <div key={category} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-700 mb-3 capitalize">
                              {category}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {permissions.map((permission) => {
                                const hasPermission = roleConfig.permissions.includes(permission.id);
                                return (
                                  <div
                                    key={permission.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${
                                      hasPermission
                                        ? `bg-${roleConfig.color}-50 border border-${roleConfig.color}-200`
                                        : 'bg-white border border-gray-200'
                                    }`}
                                  >
                                    {hasPermission ? (
                                      <Check className={`h-4 w-4 text-${roleConfig.color}-600 flex-shrink-0`} />
                                    ) : (
                                      <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium ${
                                        hasPermission ? 'text-gray-900' : 'text-gray-400'
                                      }`}>
                                        {permission.name}
                                      </p>
                                      {hasPermission && (
                                        <p className="text-xs text-gray-500 truncate">
                                          {permission.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Routes Access */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Rutas Permitidas</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {roleConfig.routes.map((route, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-${roleConfig.color}-50 border border-${roleConfig.color}-200`}
                            >
                              <Check className={`h-4 w-4 text-${roleConfig.color}-600 flex-shrink-0`} />
                              <code className="text-sm font-mono text-gray-700 truncate">
                                {route}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>Este rol tiene acceso a:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {roleConfig.routes.includes('/admin/*') && (
                              <li>Panel de Administración</li>
                            )}
                            {roleConfig.routes.includes('/seller/*') && (
                              <li>Panel de Ventas (POS)</li>
                            )}
                            {roleConfig.routes.includes('/superadmin/*') && (
                              <li>Panel de Super Administración</li>
                            )}
                            {roleConfig.routes.includes('/shop') && (
                              <li>Tienda en línea</li>
                            )}
                          </ul>
                        </div>
                        <div className={`text-right bg-${roleConfig.color}-50 rounded-lg p-4`}>
                          <p className="text-sm text-gray-600">Total permisos</p>
                          <p className={`text-3xl font-bold text-${roleConfig.color}-700`}>
                            {roleConfig.permissions.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Permissions Legend */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistema de Permisos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Categorías de Permisos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span><strong>Productos:</strong> Gestión completa del catálogo</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span><strong>Ventas:</strong> Procesamiento de transacciones</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span><strong>Usuarios:</strong> Administración de cuentas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span><strong>Sistema:</strong> Configuración técnica</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span><strong>Reportes:</strong> Análisis y exportación</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Jerarquía de Roles</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50">
                <Crown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Super Admin</p>
                  <p className="text-xs text-red-700">Control total del sistema</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-rose-50">
                <Shield className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="font-semibold text-rose-900">Admin</p>
                  <p className="text-xs text-rose-700">Gestión de tienda y productos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-indigo-50">
                <Store className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-indigo-900">Vendedor</p>
                  <p className="text-xs text-indigo-700">Ventas y punto de venta</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Cliente</p>
                  <p className="text-xs text-gray-700">Compras en línea</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
