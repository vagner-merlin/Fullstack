/**
 * Servicio de Logs del Sistema
 */

export type LogAction = 
  | 'user.login'
  | 'user.logout'
  | 'user.register'
  | 'user.role_changed'
  | 'user.status_changed'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'sale.created'
  | 'order.created'
  | 'order.status_changed'
  | 'system.settings_changed'
  | 'system.backup'
  | 'system.error';

export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface SystemLog {
  id: number;
  timestamp: string;
  action: LogAction;
  level: LogLevel;
  user_id?: number;
  user_email?: string;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
}

const STORAGE_KEY = 'boutique_system_logs';
const MAX_LOGS = 1000; // Máximo de logs a guardar

/**
 * Obtiene todos los logs del sistema
 */
export const getAllLogs = (): SystemLog[] => {
  try {
    const logsStr = localStorage.getItem(STORAGE_KEY);
    return logsStr ? JSON.parse(logsStr) : [];
  } catch (error) {
    console.error('Error al cargar logs:', error);
    return [];
  }
};

/**
 * Guarda logs en localStorage
 */
const saveLogs = (logs: SystemLog[]): void => {
  try {
    // Mantener solo los últimos MAX_LOGS registros
    const trimmedLogs = logs.slice(-MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Error al guardar logs:', error);
  }
};

/**
 * Crea un nuevo log
 */
export const createLog = (
  action: LogAction,
  description: string,
  options?: {
    level?: LogLevel;
    user_id?: number;
    user_email?: string;
    metadata?: Record<string, unknown>;
    ip_address?: string;
  }
): SystemLog => {
  const logs = getAllLogs();

  const newLog: SystemLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    action,
    level: options?.level || 'info',
    user_id: options?.user_id,
    user_email: options?.user_email,
    description,
    metadata: options?.metadata,
    ip_address: options?.ip_address,
  };

  logs.push(newLog);
  saveLogs(logs);

  return newLog;
};

/**
 * Registra login de usuario
 */
export const logUserLogin = (userId: number, userEmail: string): void => {
  createLog('user.login', `Usuario ${userEmail} inició sesión`, {
    level: 'success',
    user_id: userId,
    user_email: userEmail,
  });
};

/**
 * Registra logout de usuario
 */
export const logUserLogout = (userId: number, userEmail: string): void => {
  createLog('user.logout', `Usuario ${userEmail} cerró sesión`, {
    level: 'info',
    user_id: userId,
    user_email: userEmail,
  });
};

/**
 * Registra cambio de rol
 */
export const logRoleChange = (
  adminId: number,
  adminEmail: string,
  targetUserId: number,
  targetEmail: string,
  oldRole: string,
  newRole: string
): void => {
  createLog('user.role_changed', `Rol de ${targetEmail} cambiado de ${oldRole} a ${newRole}`, {
    level: 'warning',
    user_id: adminId,
    user_email: adminEmail,
    metadata: {
      target_user_id: targetUserId,
      target_email: targetEmail,
      old_role: oldRole,
      new_role: newRole,
    },
  });
};

/**
 * Registra cambio de estado de usuario
 */
export const logUserStatusChange = (
  adminId: number,
  adminEmail: string,
  targetUserId: number,
  targetEmail: string,
  newStatus: boolean
): void => {
  createLog('user.status_changed', `Usuario ${targetEmail} ${newStatus ? 'activado' : 'desactivado'}`, {
    level: 'warning',
    user_id: adminId,
    user_email: adminEmail,
    metadata: {
      target_user_id: targetUserId,
      target_email: targetEmail,
      new_status: newStatus,
    },
  });
};

/**
 * Registra creación de producto
 */
export const logProductCreated = (userId: number, userEmail: string, productName: string): void => {
  createLog('product.created', `Producto "${productName}" creado`, {
    level: 'success',
    user_id: userId,
    user_email: userEmail,
    metadata: { product_name: productName },
  });
};

/**
 * Registra venta
 */
export const logSaleCreated = (sellerId: number, sellerEmail: string, saleNumber: string, total: number): void => {
  createLog('sale.created', `Venta ${saleNumber} registrada por Bs ${total.toFixed(2)}`, {
    level: 'success',
    user_id: sellerId,
    user_email: sellerEmail,
    metadata: { sale_number: saleNumber, total },
  });
};

/**
 * Registra error del sistema
 */
export const logSystemError = (description: string, error?: Error): void => {
  createLog('system.error', description, {
    level: 'error',
    metadata: error ? { message: error.message, stack: error.stack } : undefined,
  });
};

/**
 * Obtiene logs filtrados
 */
export const getFilteredLogs = (filters: {
  action?: LogAction;
  level?: LogLevel;
  user_id?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}): SystemLog[] => {
  let logs = getAllLogs();

  if (filters.action) {
    logs = logs.filter(log => log.action === filters.action);
  }

  if (filters.level) {
    logs = logs.filter(log => log.level === filters.level);
  }

  if (filters.user_id) {
    logs = logs.filter(log => log.user_id === filters.user_id);
  }

  if (filters.startDate) {
    logs = logs.filter(log => new Date(log.timestamp) >= filters.startDate!);
  }

  if (filters.endDate) {
    logs = logs.filter(log => new Date(log.timestamp) <= filters.endDate!);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    logs = logs.filter(log =>
      log.description.toLowerCase().includes(searchLower) ||
      log.user_email?.toLowerCase().includes(searchLower)
    );
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Obtiene logs recientes
 */
export const getRecentLogs = (limit: number = 50): SystemLog[] => {
  const logs = getAllLogs();
  return logs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

/**
 * Obtiene estadísticas de logs
 */
export const getLogStats = () => {
  const logs = getAllLogs();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    total: logs.length,
    today: logs.filter(log => new Date(log.timestamp) >= today).length,
    this_week: logs.filter(log => new Date(log.timestamp) >= thisWeek).length,
    by_level: {
      info: logs.filter(log => log.level === 'info').length,
      success: logs.filter(log => log.level === 'success').length,
      warning: logs.filter(log => log.level === 'warning').length,
      error: logs.filter(log => log.level === 'error').length,
    },
    by_action: {
      user_actions: logs.filter(log => log.action.startsWith('user.')).length,
      product_actions: logs.filter(log => log.action.startsWith('product.')).length,
      sale_actions: logs.filter(log => log.action.startsWith('sale.') || log.action.startsWith('order.')).length,
      system_actions: logs.filter(log => log.action.startsWith('system.')).length,
    },
  };
};

/**
 * Limpia logs antiguos
 */
export const clearOldLogs = (daysToKeep: number = 30): number => {
  const logs = getAllLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const filteredLogs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
  const removedCount = logs.length - filteredLogs.length;

  saveLogs(filteredLogs);
  return removedCount;
};

/**
 * Exporta logs a JSON
 */
export const exportLogs = (): string => {
  const logs = getAllLogs();
  return JSON.stringify(logs, null, 2);
};

/**
 * Limpia todos los logs
 */
export const clearAllLogs = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
