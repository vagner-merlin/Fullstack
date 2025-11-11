import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { generateProductPredictions, type ProductPrediction } from '../../services/admin/aiAnalyticsService';

export const PredictionsPanel = () => {
  const [predictions, setPredictions] = useState<ProductPrediction[]>([]);

  useEffect(() => {
    const loadPredictions = async () => {
      const data = await generateProductPredictions();
      setPredictions(data.slice(0, 8));
    };
    loadPredictions();
  }, []);

  const getTrendIcon = (trend: ProductPrediction['trend']) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: ProductPrediction['trend']) => {
    switch (trend) {
      case 'up': return 'green';
      case 'down': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl shadow-xl p-6 border-2 border-indigo-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Predicciones de Demanda</h3>
          <p className="text-sm text-gray-600">Análisis basado en IA para próximos 30 días</p>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((prediction, idx) => {
          const TrendIcon = getTrendIcon(prediction.trend);
          const trendColor = getTrendColor(prediction.trend);
          const growthRate = ((prediction.predicted_sales - prediction.current_sales) / Math.max(prediction.current_sales, 1) * 100).toFixed(1);

          return (
            <motion.div
              key={prediction.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-4 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              {/* Product Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {prediction.product_name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <TrendIcon className={`h-4 w-4 text-${trendColor}-600`} />
                    <span className={`text-xs font-medium text-${trendColor}-700`}>
                      {prediction.trend === 'up' ? 'Tendencia Alcista' : prediction.trend === 'down' ? 'Tendencia Bajista' : 'Estable'}
                    </span>
                  </div>
                </div>
                {prediction.stock_alert && (
                  <AlertCircle className="h-5 w-5 text-red-500" aria-label="Stock Bajo" />
                )}
              </div>

              {/* Sales Data */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Ventas Actuales</p>
                  <p className="text-lg font-bold text-gray-900">{prediction.current_sales}</p>
                </div>
                <div className={`bg-${trendColor}-50 rounded-lg p-2`}>
                  <p className={`text-xs text-${trendColor}-700`}>Predicción</p>
                  <p className={`text-lg font-bold text-${trendColor}-900`}>
                    {prediction.predicted_sales}
                  </p>
                </div>
              </div>

              {/* Growth Rate */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Cambio Esperado</span>
                  <span className={`font-semibold text-${trendColor}-700`}>
                    {growthRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${trendColor}-500`}
                    style={{ width: `${Math.min(Math.abs(parseFloat(growthRate)), 100)}%` }}
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div className={`bg-${trendColor}-50 rounded-lg p-2 border border-${trendColor}-200`}>
                <p className="text-xs text-gray-700">
                  <strong>💡 Recomendación:</strong> {prediction.recommendation}
                </p>
              </div>

              {/* Confidence */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-gray-600">Confianza</span>
                </div>
                <span className="text-xs font-semibold text-green-700">
                  {prediction.confidence}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
          <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-900">
            {predictions.filter(p => p.trend === 'up').length}
          </p>
          <p className="text-xs text-green-700">Productos al Alza</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
          <TrendingDown className="h-6 w-6 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-900">
            {predictions.filter(p => p.trend === 'down').length}
          </p>
          <p className="text-xs text-red-700">Requieren Atención</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
          <AlertCircle className="h-6 w-6 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-yellow-900">
            {predictions.filter(p => p.stock_alert).length}
          </p>
          <p className="text-xs text-yellow-700">Alertas de Stock</p>
        </div>
      </div>
    </div>
  );
};
