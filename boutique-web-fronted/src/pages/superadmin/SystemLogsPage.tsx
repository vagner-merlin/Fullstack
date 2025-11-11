import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Trash2, Search, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  getAllLogs,
  getFilteredLogs,
  getLogStats,
  exportLogs,
  clearOldLogs,
  type SystemLog,
  type LogLevel,
  type LogAction
} from '../../services/superadmin/systemLogsService';
import { showToast } from '../../utils/toast';

const getLevelIcon = (level: LogLevel) => {
  switch (level) {
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    case 'success': return CheckCircle;
    default: return Info;
  }
};

const getLevelColor = (level: LogLevel) => {
  switch (level) {
    case 'error': return 'red';
    case 'warning': return 'yellow';
    case 'success': return 'green';
    default: return 'blue';
  }
};

export const SystemLogsPage = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState(getLogStats());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all');
  const [filterAction, setFilterAction] = useState<LogAction | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const allLogs = getAllLogs();
    setLogs(allLogs);
    setStats(getLogStats());
  };

  const applyFilters = () => {
    const filters: {
      level?: LogLevel;
      action?: LogAction;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    } = {};

    if (filterLevel !== 'all') filters.level = filterLevel;
    if (filterAction !== 'all') filters.action = filterAction;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (searchTerm) filters.search = searchTerm;

    const filtered = getFilteredLogs(filters);
    setLogs(filtered);
    setCurrentPage(1);
  };

  const handleExport = () => {
    try {
      const data = exportLogs();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      showToast.success('Logs exportados exitosamente');
    } catch {
      showToast.error('Error al exportar logs');
    }
  };

  const handleClearOld = () => {
    if (!confirm('¿Eliminar logs con más de 30 días?')) return;

    try {
      clearOldLogs(30);
      loadLogs();
      showToast.success('Logs antiguos eliminados');
    } catch {
      showToast.error('Error al limpiar logs');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterLevel('all');
    setFilterAction('all');
    setStartDate('');
    setEndDate('');
    loadLogs();
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Logs del Sistema</h2>
          <p className="text-gray-600 mt-2">Registro de actividad y auditoría</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Exportar
          </button>
          <button
            onClick={handleClearOld}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            Limpiar Antiguos
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
          <p className="text-sm text-blue-700">Hoy</p>
          <p className="text-2xl font-bold text-blue-900">{stats.today}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4 border border-green-200">
          <p className="text-sm text-green-700">Exitosos</p>
          <p className="text-2xl font-bold text-green-900">{stats.by_level.success}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm p-4 border border-blue-200">
          <p className="text-sm text-blue-700">Info</p>
          <p className="text-2xl font-bold text-blue-900">{stats.by_level.info}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
          <p className="text-sm text-yellow-700">Advertencias</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.by_level.warning}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm p-4 border border-red-200">
          <p className="text-sm text-red-700">Errores</p>
          <p className="text-2xl font-bold text-red-900">{stats.by_level.error}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Todos los niveles</option>
            <option value="info">Info</option>
            <option value="success">Exitoso</option>
            <option value="warning">Advertencia</option>
            <option value="error">Error</option>
          </select>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value as LogAction | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Todas las acciones</option>
            <optgroup label="Usuario">
              <option value="user.login">Login</option>
              <option value="user.logout">Logout</option>
              <option value="user.role_changed">Cambio de rol</option>
              <option value="user.status_changed">Cambio de estado</option>
            </optgroup>
            <optgroup label="Producto">
              <option value="product.created">Producto creado</option>
              <option value="product.updated">Producto actualizado</option>
              <option value="product.deleted">Producto eliminado</option>
            </optgroup>
            <optgroup label="Ventas">
              <option value="sale.created">Venta creada</option>
              <option value="order.status_changed">Estado de orden</option>
            </optgroup>
            <optgroup label="Sistema">
              <option value="system.error">Error del sistema</option>
            </optgroup>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Fecha inicio"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Fecha fin"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={applyFilters}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
            Aplicar Filtros
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nivel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLogs.map((log) => {
                const LevelIcon = getLevelIcon(log.level);
                const levelColor = getLevelColor(log.level);

                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-${levelColor}-100 text-${levelColor}-800`}>
                        <LevelIcon className="h-3 w-3" />
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.action}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{log.user_email || 'Sistema'}</div>
                      {log.ip_address && (
                        <div className="text-xs text-gray-500">{log.ip_address}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{log.description}</p>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="mt-1">
                          <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                            Ver detalles
                          </summary>
                          <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron registros</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="text-sm text-gray-600">
            Mostrando {indexOfFirstLog + 1} - {Math.min(indexOfLastLog, logs.length)} de {logs.length} registros
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-red-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Activity Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm p-6 border-2 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.by_action).slice(0, 8).map(([action, count]) => (
            <div key={action} className="bg-white rounded-lg p-3 border border-purple-100">
              <code className="text-xs text-purple-700">{action}</code>
              <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
