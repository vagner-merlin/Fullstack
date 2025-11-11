import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { AIAssistantChat } from '../../components/admin/AIAssistantChat';
import { PredictionsPanel } from '../../components/admin/PredictionsPanel';
import { ReportsExportPanel } from '../../components/admin/ReportsExportPanel';
import { getAIStats, generateAIInsights, type AIInsight } from '../../services/admin/aiAnalyticsService';

export const AIAnalyticsPage = () => {
  const [stats, setStats] = useState({
    total_insights: 0,
    critical_alerts: 0,
    warnings: 0,
    opportunities: 0,
    avg_confidence: 0,
    trending_up: 0,
    trending_down: 0,
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const aiStats = await getAIStats();
      const aiInsights = await generateAIInsights();
      setStats(aiStats);
      setInsights(aiInsights);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <Brain className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              IA Analytics Dashboard
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </h1>
            <p className="text-purple-100 mt-1">
              Análisis Predictivo · Reportes Inteligentes · Asistente IA
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-purple-200 text-sm">Total Insights</p>
            <p className="text-3xl font-bold">{stats.total_insights}</p>
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4">
            <AlertTriangle className="h-5 w-5 text-red-200 mb-1" />
            <p className="text-red-200 text-sm">Alertas</p>
            <p className="text-3xl font-bold">{stats.warnings + stats.critical_alerts}</p>
          </div>
          <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4">
            <CheckCircle className="h-5 w-5 text-green-200 mb-1" />
            <p className="text-green-200 text-sm">Oportunidades</p>
            <p className="text-3xl font-bold">{stats.opportunities}</p>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4">
            <TrendingUp className="h-5 w-5 text-blue-200 mb-1" />
            <p className="text-blue-200 text-sm">En Alza</p>
            <p className="text-3xl font-bold">{stats.trending_up}</p>
          </div>
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-yellow-200 text-sm">Confianza IA</p>
            <p className="text-3xl font-bold">{stats.avg_confidence}%</p>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Assistant - Spans 2 columns on large screens */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 h-[600px]"
        >
          <AIAssistantChat />
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-gray-900">Insights Rápidos</h3>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {insights.slice(0, 6).map((insight: AIInsight) => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-lg border-2 ${
                    insight.type === 'success' ? 'bg-green-50 border-green-200' :
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    insight.type === 'danger' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {insight.type === 'success' ? '✅' :
                       insight.type === 'warning' ? '⚠️' :
                       insight.type === 'danger' ? '🚨' : 'ℹ️'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {insight.description}
                      </p>
                      {insight.value !== undefined && (
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {insight.value}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              insight.type === 'success' ? 'bg-green-500' :
                              insight.type === 'warning' ? 'bg-yellow-500' :
                              insight.type === 'danger' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {insight.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Predictions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <PredictionsPanel />
      </motion.div>

      {/* Reports Export Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ReportsExportPanel />
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200"
      >
        <div className="flex items-center gap-3 mb-3">
          <Download className="h-5 w-5 text-gray-600" />
          <h4 className="font-semibold text-gray-900">Cómo usar IA Analytics</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <strong className="text-purple-700">💬 Chat IA:</strong>
            <p>Haz preguntas por texto o voz. La IA te dará insights personalizados.</p>
          </div>
          <div>
            <strong className="text-red-700">🎤 Comandos de Voz:</strong>
            <p>Click en micrófono, habla tu pregunta. Toggle 🔊/🔇 para audio automático.</p>
          </div>
          <div>
            <strong className="text-indigo-700">📈 Predicciones:</strong>
            <p>Visualiza demanda futura y recomendaciones de stock inteligentes.</p>
          </div>
          <div>
            <strong className="text-teal-700">📄 Reportes:</strong>
            <p>Exporta análisis en PDF, Excel o CSV con un clic.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
