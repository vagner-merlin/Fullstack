/**
 * Servicio de Roles y Permisos
 */

import type { UserRole } from './userManagementService';

// Re-export UserRole for convenience
export type { UserRole };

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'productos' | 'ventas' | 'usuarios' | 'sistema' | 'reportes';
}

export interface RolePermissions {
  role: UserRole;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  routes: string[];
}

/**
 * Definición de todos los permisos del sistema
 */
export const ALL_PERMISSIONS: Permission[] = [
  // Productos
  { id: 'products.view', name: 'Ver Productos', description: 'Ver catálogo de productos', category: 'productos' },
  { id: 'products.create', name: 'Crear Productos', description: 'Crear nuevos productos', category: 'productos' },
  { id: 'products.edit', name: 'Editar Productos', description: 'Modificar productos existentes', category: 'productos' },
  { id: 'products.delete', name: 'Eliminar Productos', description: 'Eliminar productos', category: 'productos' },
  { id: 'products.manage_stock', name: 'Gestionar Stock', description: 'Actualizar inventario', category: 'productos' },
  
  // Ventas
  { id: 'sales.view', name: 'Ver Ventas', description: 'Ver historial de ventas', category: 'ventas' },
  { id: 'sales.create', name: 'Registrar Ventas', description: 'Registrar nuevas ventas (POS)', category: 'ventas' },
  { id: 'sales.manage_orders', name: 'Gestionar Pedidos', description: 'Administrar pedidos online', category: 'ventas' },
  { id: 'sales.refunds', name: 'Procesar Devoluciones', description: 'Gestionar reembolsos', category: 'ventas' },
  
  // Usuarios
  { id: 'users.view', name: 'Ver Usuarios', description: 'Ver lista de usuarios', category: 'usuarios' },
  { id: 'users.create', name: 'Crear Usuarios', description: 'Registrar nuevos usuarios', category: 'usuarios' },
  { id: 'users.edit', name: 'Editar Usuarios', description: 'Modificar datos de usuarios', category: 'usuarios' },
  { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios', category: 'usuarios' },
  { id: 'users.manage_roles', name: 'Gestionar Roles', description: 'Cambiar roles de usuarios', category: 'usuarios' },
  
  // Sistema
  { id: 'system.view_logs', name: 'Ver Logs', description: 'Ver logs del sistema', category: 'sistema' },
  { id: 'system.manage_settings', name: 'Gestionar Configuración', description: 'Modificar configuración del sistema', category: 'sistema' },
  { id: 'system.backup', name: 'Backup/Restaurar', description: 'Realizar backups y restauración', category: 'sistema' },
  { id: 'system.maintenance', name: 'Mantenimiento', description: 'Modo mantenimiento', category: 'sistema' },
  
  // Reportes
  { id: 'reports.sales', name: 'Reportes de Ventas', description: 'Generar reportes de ventas', category: 'reportes' },
  { id: 'reports.inventory', name: 'Reportes de Inventario', description: 'Reportes de stock', category: 'reportes' },
  { id: 'reports.financial', name: 'Reportes Financieros', description: 'Reportes contables', category: 'reportes' },
  { id: 'reports.export', name: 'Exportar Reportes', description: 'Exportar a Excel/PDF', category: 'reportes' },
];

/**
 * Configuración de permisos por rol
 */
export const ROLES_CONFIG: RolePermissions[] = [
  {
    role: 'superadmin',
    name: 'Super Administrador',
    description: 'Control total del sistema',
    color: 'red',
    permissions: ALL_PERMISSIONS.map(p => p.id), // Todos los permisos
    routes: ['/', '/shop', '/admin/*', '/seller/*', '/superadmin/*'],
  },
  {
    role: 'admin',
    name: 'Administrador',
    description: 'Gestión de boutique y ventas',
    color: 'rose',
    permissions: [
      'products.view',
      'products.create',
      'products.edit',
      'products.delete',
      'products.manage_stock',
      'sales.view',
      'sales.create',
      'sales.manage_orders',
      'sales.refunds',
      'users.view',
      'reports.sales',
      'reports.inventory',
      'reports.financial',
      'reports.export',
    ],
    routes: ['/', '/shop', '/admin/*', '/seller/*'],
  },
  {
    role: 'seller',
    name: 'Vendedor',
    description: 'Punto de venta y ventas físicas',
    color: 'indigo',
    permissions: [
      'products.view',
      'sales.view',
      'sales.create',
      'reports.sales',
    ],
    routes: ['/', '/shop', '/seller/*'],
  },
  {
    role: 'cliente',
    name: 'Cliente',
    description: 'Compras online',
    color: 'blue',
    permissions: [
      'products.view',
    ],
    routes: ['/', '/shop', '/cart', '/checkout', '/orders', '/profile', '/favorites'],
  },
];

/**
 * Obtiene configuración de un rol
 */
export const getRoleConfig = (role: UserRole): RolePermissions | null => {
  return ROLES_CONFIG.find(r => r.role === role) || null;
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export const hasPermission = (role: UserRole, permissionId: string): boolean => {
  const roleConfig = getRoleConfig(role);
  return roleConfig ? roleConfig.permissions.includes(permissionId) : false;
};

/**
 * Verifica si un rol tiene acceso a una ruta
 */
export const hasRouteAccess = (role: UserRole, route: string): boolean => {
  const roleConfig = getRoleConfig(role);
  if (!roleConfig) return false;

  return roleConfig.routes.some(allowedRoute => {
    if (allowedRoute.endsWith('/*')) {
      const baseRoute = allowedRoute.slice(0, -2);
      return route.startsWith(baseRoute);
    }
    return route === allowedRoute;
  });
};

/**
 * Obtiene todos los permisos de un rol
 */
export const getRolePermissions = (role: UserRole): Permission[] => {
  const roleConfig = getRoleConfig(role);
  if (!roleConfig) return [];

  return ALL_PERMISSIONS.filter(p => roleConfig.permissions.includes(p.id));
};

/**
 * Obtiene permisos agrupados por categoría
 */
export const getPermissionsByCategory = () => {
  const grouped: Record<string, Permission[]> = {
    productos: [],
    ventas: [],
    usuarios: [],
    sistema: [],
    reportes: [],
  };

  ALL_PERMISSIONS.forEach(permission => {
    grouped[permission.category].push(permission);
  });

  return grouped;
};

/**
 * Obtiene estadísticas de roles
 */
export const getRoleStats = () => {
  return ROLES_CONFIG.map(role => ({
    role: role.role,
    name: role.name,
    color: role.color,
    permissions_count: role.permissions.length,
    routes_count: role.routes.length,
  }));
};
