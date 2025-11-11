/**
 * Servicio de IA para Análisis Predictivo y Reportes
 * Exclusivo para el Panel del Administrador
 */

import { getAllProducts, type AdminProduct } from './productAdminService';
import { getDashboardStats } from './dashboardService';
import type { Order } from '../orderService';

// Helper para obtener órdenes del localStorage
const getAllOrders = (): Order[] => {
  try {
    const ordersStr = localStorage.getItem('orders');
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    return [];
  }
};

// Tipos de análisis de IA
export type AnalysisType = 'sales' | 'inventory' | 'trends' | 'predictions' | 'customers';
export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  category: AnalysisType;
  title: string;
  description: string;
  value?: number;
  change?: number;
  recommendation: string;
  confidence: number; // 0-100
  timestamp: Date;
}

export interface ProductPrediction {
  product_id: number;
  product_name: string;
  current_sales: number;
  predicted_sales: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  recommendation: string;
  stock_alert?: boolean;
}

export interface SalesTrend {
  period: string;
  sales: number;
  revenue: number;
  orders: number;
  average_ticket: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  insights?: AIInsight[];
  charts?: ChartData[];
}

interface ChartData {
  type: 'line' | 'bar' | 'pie';
  data: Record<string, unknown>;
}

// Simular respuestas de IA (en producción se conectaría a OpenAI, Claude, etc.)
const AI_RESPONSES: Record<string, string> = {
  'ventas': 'He analizado tus ventas recientes. En los últimos 7 días, has vendido {total_orders} productos con un ingreso total de Bs. {total_revenue}. El producto más vendido es "{top_product}" con {top_sales} unidades.',
  'inventario': 'Tu inventario actual tiene {total_products} productos. Detecté {low_stock} productos con stock bajo que necesitan reabastecimiento urgente.',
  'tendencias': 'Las tendencias de venta muestran un incremento del {growth}% en la última semana. Los días con mayor venta son {peak_days}.',
  'predicciones': 'Basado en el historial, se predice que los siguientes productos tendrán alta demanda: {predicted_products}. Recomiendo aumentar el stock.',
  'clientes': 'Tienes {total_customers} clientes activos. El ticket promedio es de Bs. {avg_ticket}. {top_customers} clientes representan el 80% de tus ventas.',
  'reportes': 'Puedo generar reportes en PDF, Excel o CSV. ¿Qué tipo de reporte necesitas? (Ventas, Inventario, Productos, Clientes)',
  'ayuda': 'Puedo ayudarte con: 📊 Análisis de ventas, 📦 Gestión de inventario, 📈 Predicciones de demanda, 👥 Comportamiento de clientes, 📄 Generación de reportes. ¿Qué te gustaría saber?',
};

/**
 * Genera insights automáticos basados en los datos
 */
export const generateAIInsights = async (): Promise<AIInsight[]> => {
  const products = await getAllProducts();
  const orders = getAllOrders();
  const stats = await getDashboardStats();
  const insights: AIInsight[] = [];

  // Análisis de stock bajo
  const lowStockProducts = products.filter((p: AdminProduct) => p.stock_total < 10);
  if (lowStockProducts.length > 0) {
    insights.push({
      id: `insight-${Date.now()}-1`,
      type: 'warning',
      category: 'inventory',
      title: '⚠️ Stock Bajo Detectado',
      description: `${lowStockProducts.length} productos tienen menos de 10 unidades en stock`,
      value: lowStockProducts.length,
      recommendation: `Reabastecer: ${lowStockProducts.slice(0, 3).map((p: AdminProduct) => p.nombre).join(', ')}`,
      confidence: 95,
      timestamp: new Date(),
    });
  }

  // Análisis de productos sin ventas
  const productsWithoutSales = products.filter((p: AdminProduct) => {
    const productOrders = orders.filter(o => 
      o.items.some(item => item.producto_id === p.id)
    );
    return productOrders.length === 0;
  });

  if (productsWithoutSales.length > 0) {
    insights.push({
      id: `insight-${Date.now()}-2`,
      type: 'info',
      category: 'sales',
      title: '📦 Productos Sin Ventas',
      description: `${productsWithoutSales.length} productos no han tenido ventas recientes`,
      value: productsWithoutSales.length,
      recommendation: 'Considera crear promociones o descuentos para estos productos',
      confidence: 88,
      timestamp: new Date(),
    });
  }

  // Análisis de tendencias de precio
  const avgPrice = products.reduce((sum: number, p: AdminProduct) => sum + p.precio, 0) / products.length;
  const highValueProducts = products.filter((p: AdminProduct) => p.precio > avgPrice * 1.5);
  
  insights.push({
    id: `insight-${Date.now()}-3`,
    type: 'success',
    category: 'trends',
    title: '💎 Productos Premium',
    description: `Tienes ${highValueProducts.length} productos de alto valor (>${avgPrice.toFixed(0)} Bs)`,
    value: highValueProducts.length,
    recommendation: 'Enfoca marketing en estos productos para maximizar ingresos',
    confidence: 92,
    timestamp: new Date(),
  });

  // Análisis de ventas semanales
  const weeklyRevenue = stats.ingresos_totales;
  const dailyAvg = weeklyRevenue / 7;
  
  insights.push({
    id: `insight-${Date.now()}-4`,
    type: weeklyRevenue > 1000 ? 'success' : 'warning',
    category: 'sales',
    title: '📈 Desempeño Semanal',
    description: `Ingresos totales: Bs. ${weeklyRevenue.toFixed(2)}`,
    value: weeklyRevenue,
    change: dailyAvg,
    recommendation: weeklyRevenue > 1000 
      ? 'Excelente desempeño. Mantén la estrategia actual.'
      : 'Considera aumentar esfuerzos de marketing y promociones.',
    confidence: 96,
    timestamp: new Date(),
  });

  return insights;
};

/**
 * Genera predicciones de productos
 */
export const generateProductPredictions = async (): Promise<ProductPrediction[]> => {
  const products = await getAllProducts();
  const orders = getAllOrders();
  const predictions: ProductPrediction[] = [];

  products.forEach((product: AdminProduct) => {
    // Contar ventas del producto
    const productSales = orders.reduce((sum: number, order) => {
      const item = order.items.find(i => i.producto_id === product.id);
      return sum + (item?.cantidad || 0);
    }, 0);

    // Simular predicción con variación aleatoria
    const trendFactor = Math.random() * 0.4 + 0.8; // 0.8 a 1.2
    const predictedSales = Math.round(productSales * trendFactor * 1.3);

    let trend: 'up' | 'down' | 'stable';
    if (trendFactor > 1.1) trend = 'up';
    else if (trendFactor < 0.9) trend = 'down';
    else trend = 'stable';

    predictions.push({
      product_id: product.id,
      product_name: product.nombre,
      current_sales: productSales,
      predicted_sales: predictedSales,
      trend,
      confidence: Math.round(75 + Math.random() * 20),
      recommendation: trend === 'up' 
        ? `Aumentar stock. Se espera incremento del ${((trendFactor - 1) * 100).toFixed(0)}%`
        : trend === 'down'
        ? 'Crear promociones para impulsar ventas'
        : 'Mantener nivel actual de inventario',
      stock_alert: product.stock_total < predictedSales * 0.5,
    });
  });

  // Ordenar por ventas predichas
  return predictions.sort((a, b) => b.predicted_sales - a.predicted_sales);
};

/**
 * Genera tendencias de ventas
 */
export const generateSalesTrends = (): SalesTrend[] => {
  const trends: SalesTrend[] = [];

  // Últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });

    // Simular datos (en producción filtrar por fecha real)
    const dayOrders = Math.floor(Math.random() * 10) + 5;
    const revenue = dayOrders * (Math.random() * 200 + 100);

    trends.push({
      period: dateStr,
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: revenue,
      orders: dayOrders,
      average_ticket: revenue / dayOrders,
    });
  }

  return trends;
};

/**
 * Procesa pregunta del chat y genera respuesta de IA
 */
export const processAIQuestion = async (question: string): Promise<ChatMessage> => {
  const lowerQ = question.toLowerCase();
  const products = await getAllProducts();
  const orders = getAllOrders();
  const stats = await getDashboardStats();

  let response = '';
  let insights: AIInsight[] = [];

  // Detectar intención
  if (lowerQ.includes('venta') || lowerQ.includes('ventas') || lowerQ.includes('vendido')) {
    const topProduct = products.sort((a: AdminProduct, b: AdminProduct) => {
      const aSales = orders.filter(o => o.items.some(i => i.producto_id === a.id)).length;
      const bSales = orders.filter(o => o.items.some(i => i.producto_id === b.id)).length;
      return bSales - aSales;
    })[0];

    response = AI_RESPONSES.ventas
      .replace('{total_orders}', orders.length.toString())
      .replace('{total_revenue}', stats.ingresos_totales.toFixed(2))
      .replace('{top_product}', topProduct?.nombre || 'N/A')
      .replace('{top_sales}', '15'); // Simular

    insights = (await generateAIInsights()).filter(i => i.category === 'sales');
  }
  else if (lowerQ.includes('inventario') || lowerQ.includes('stock') || lowerQ.includes('producto')) {
    const lowStock = products.filter((p: AdminProduct) => p.stock_total < 10).length;
    response = AI_RESPONSES.inventario
      .replace('{total_products}', products.length.toString())
      .replace('{low_stock}', lowStock.toString());

    insights = (await generateAIInsights()).filter(i => i.category === 'inventory');
  }
  else if (lowerQ.includes('tendencia') || lowerQ.includes('trend') || lowerQ.includes('crecimiento')) {
    response = AI_RESPONSES.tendencias
      .replace('{growth}', '12')
      .replace('{peak_days}', 'Viernes y Sábado');

    insights = (await generateAIInsights()).filter(i => i.category === 'trends');
  }
  else if (lowerQ.includes('predicc') || lowerQ.includes('futuro') || lowerQ.includes('demanda')) {
    const predictions = (await generateProductPredictions()).slice(0, 3);
    response = AI_RESPONSES.predicciones
      .replace('{predicted_products}', predictions.map(p => p.product_name).join(', '));

    insights = (await generateAIInsights()).filter(i => i.category === 'predictions');
  }
  else if (lowerQ.includes('reporte') || lowerQ.includes('export') || lowerQ.includes('pdf') || lowerQ.includes('excel')) {
    response = AI_RESPONSES.reportes;
  }
  else {
    response = AI_RESPONSES.ayuda;
    insights = (await generateAIInsights()).slice(0, 3);
  }

  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp: new Date(),
    insights,
  };
};

/**
 * Exporta reporte en el formato especificado
 */
export const exportReport = async (format: ReportFormat, type: AnalysisType): Promise<string> => {
  const products = await getAllProducts();
  const orders = getAllOrders();
  const stats = await getDashboardStats();
  const timestamp = new Date().toISOString().split('T')[0];

  if (format === 'csv') {
    let csv = '';
    
    if (type === 'sales') {
      csv = 'Fecha,Orden,Cliente,Total,Estado\n';
      orders.forEach(order => {
        csv += `${new Date(order.fecha_creacion).toLocaleDateString()},${order.numero_pedido},Cliente,${order.total},${order.estado}\n`;
      });
    } else if (type === 'inventory') {
      csv = 'Producto,Categoría,Precio,Stock,Estado\n';
      products.forEach((p: AdminProduct) => {
        csv += `${p.nombre},${p.categoria_nombre || 'N/A'},${p.precio},${p.stock_total},${p.stock_total < 10 ? 'Bajo' : 'OK'}\n`;
      });
    }

    return csv;
  }

  if (format === 'excel') {
    // Simular estructura de Excel (en producción usar biblioteca como xlsx)
    return JSON.stringify({
      sheets: [
        {
          name: type === 'sales' ? 'Ventas' : 'Inventario',
          data: type === 'sales' ? orders : products,
        },
        {
          name: 'Estadísticas',
          data: stats,
        },
      ],
    }, null, 2);
  }

  if (format === 'pdf') {
    // Simular estructura de PDF (en producción usar jsPDF)
    return JSON.stringify({
      title: `Reporte de ${type === 'sales' ? 'Ventas' : 'Inventario'}`,
      date: timestamp,
      summary: stats,
      data: type === 'sales' ? orders.slice(0, 20) : products.slice(0, 20),
      charts: ['sales_chart', 'revenue_chart'],
    }, null, 2);
  }

  return '';
};

/**
 * Obtiene estadísticas de IA
 */
export const getAIStats = async () => {
  const insights = await generateAIInsights();
  const predictions = await generateProductPredictions();

  return {
    total_insights: insights.length,
    critical_alerts: insights.filter(i => i.type === 'danger').length,
    warnings: insights.filter(i => i.type === 'warning').length,
    opportunities: insights.filter(i => i.type === 'success').length,
    avg_confidence: Math.round(
      insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
    ),
    trending_up: predictions.filter(p => p.trend === 'up').length,
    trending_down: predictions.filter(p => p.trend === 'down').length,
  };
};
