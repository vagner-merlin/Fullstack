import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, FileSpreadsheet, FileBarChart, CheckCircle, type LucideIcon } from 'lucide-react';
import { exportReport, type ReportFormat, type AnalysisType } from '../../services/admin/aiAnalyticsService';
import { showToast } from '../../utils/toast';

const REPORT_TYPES: { value: AnalysisType; label: string; icon: LucideIcon; color: string }[] = [
  { value: 'sales', label: 'Ventas', icon: FileBarChart, color: 'blue' },
  { value: 'inventory', label: 'Inventario', icon: FileSpreadsheet, color: 'green' },
  { value: 'trends', label: 'Tendencias', icon: FileText, color: 'purple' },
  { value: 'predictions', label: 'Predicciones', icon: FileBarChart, color: 'orange' },
  { value: 'customers', label: 'Clientes', icon: FileText, color: 'pink' },
];

const EXPORT_FORMATS: { value: ReportFormat; label: string; icon: string; color: string }[] = [
  { value: 'pdf', label: 'PDF', icon: '📄', color: 'red' },
  { value: 'excel', label: 'Excel', icon: '📊', color: 'green' },
  { value: 'csv', label: 'CSV', icon: '📁', color: 'blue' },
];

export const ReportsExportPanel = () => {
  const [selectedType, setSelectedType] = useState<AnalysisType>('sales');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    setTimeout(async () => {
      const data = await exportReport(selectedFormat, selectedType);
      
      // Crear y descargar archivo
      const blob = new Blob([data], { 
        type: selectedFormat === 'pdf' ? 'application/pdf' : 
              selectedFormat === 'excel' ? 'application/vnd.ms-excel' : 
              'text/csv' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${selectedType}-${new Date().toISOString().split('T')[0]}.${selectedFormat === 'excel' ? 'xlsx' : selectedFormat}`;
      a.click();
      
      URL.revokeObjectURL(url);
      setIsExporting(false);
      showToast.success(`Reporte ${selectedFormat.toUpperCase()} exportado exitosamente`);
    }, 2000);
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 rounded-xl shadow-xl p-6 border-2 border-teal-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Exportación de Reportes</h3>
          <p className="text-sm text-gray-600">Genera reportes personalizados con IA</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Tipo de Reporte
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {REPORT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type.value)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                  >
                    <CheckCircle className="h-4 w-4 text-white" />
                  </motion.div>
                )}
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? `text-${type.color}-600` : 'text-gray-400'}`} />
                <p className={`text-xs font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                  {type.label}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Formato de Exportación
        </label>
        <div className="grid grid-cols-3 gap-3">
          {EXPORT_FORMATS.map((format) => {
            const isSelected = selectedFormat === format.value;
            return (
              <motion.button
                key={format.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFormat(format.value)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `border-${format.color}-500 bg-${format.color}-50 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                  >
                    <CheckCircle className="h-4 w-4 text-white" />
                  </motion.div>
                )}
                <div className="text-3xl mb-2">{format.icon}</div>
                <p className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                  {format.label}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        disabled={isExporting}
        className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isExporting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Generando Reporte...
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Exportar Reporte {selectedFormat.toUpperCase()}
          </>
        )}
      </motion.button>

      {/* Info */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
        <p className="text-sm text-gray-700">
          <strong className="text-blue-900">📊 Contenido del Reporte:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          <li>• Análisis completo de {selectedType === 'sales' ? 'ventas' : selectedType === 'inventory' ? 'inventario' : selectedType}</li>
          <li>• Gráficos y estadísticas visuales</li>
          <li>• Insights generados por IA</li>
          <li>• Recomendaciones personalizadas</li>
          <li>• Datos actualizados al momento</li>
        </ul>
      </div>
    </div>
  );
};
