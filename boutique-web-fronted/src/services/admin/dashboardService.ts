/**
 * Servicio de Estadísticas del Dashboard Admin
 */

import type { Order } from '../orderService';
import { getAllProducts } from './productAdminService';

export interface DashboardStats {
  ventas_totales: number;
  ventas_mes_actual: number;
  pedidos_totales: number;
  pedidos_pendientes: number;
  productos_totales: number;
  productos_stock_bajo: number;
  clientes_totales: number;
  ingresos_totales: number;
  ingresos_mes_actual: number;
}

export interface SalesData {
  fecha: string;
  ventas: number;
  ingresos: number;
}

export interface TopProduct {
  id: number;
  nombre: string;
  ventas: number;
  ingresos: number;
}

/**
 * Helper para obtener todas las órdenes
 */
const getAllOrders = (): Order[] => {
  try {
    const ordersStr = localStorage.getItem('orders');
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    return [];
  }
};

/**
 * Obtiene estadísticas generales del dashboard
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const orders = getAllOrders();
    const products = await getAllProducts();
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const ordersThisMonth = orders.filter((order: Order) => {
      const orderDate = new Date(order.fecha_creacion);
      return orderDate >= firstDayOfMonth;
    });
    
    const pendingOrders = orders.filter((order: Order) => 
      order.estado === 'pendiente' || order.estado === 'procesando'
    );
    
    const lowStockProducts = products.filter(p => 
      p.stock_total <= p.stock_minimo && p.activo
    );
    
    // Contar clientes únicos (simulado - necesitará user_id en Order)
    const uniqueUsers = new Set<number>();
    
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const monthRevenue = ordersThisMonth.reduce((sum: number, order: Order) => sum + order.total, 0);
    
    return {
      ventas_totales: orders.length,
      ventas_mes_actual: ordersThisMonth.length,
      pedidos_totales: orders.length,
      pedidos_pendientes: pendingOrders.length,
      productos_totales: products.length,
      productos_stock_bajo: lowStockProducts.length,
      clientes_totales: uniqueUsers.size,
      ingresos_totales: totalRevenue,
      ingresos_mes_actual: monthRevenue,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      ventas_totales: 0,
      ventas_mes_actual: 0,
      pedidos_totales: 0,
      pedidos_pendientes: 0,
      productos_totales: 0,
      productos_stock_bajo: 0,
      clientes_totales: 0,
      ingresos_totales: 0,
      ingresos_mes_actual: 0,
    };
  }
};

/**
 * Obtiene datos de ventas de los últimos 7 días
 */
export const getWeeklySales = async (): Promise<SalesData[]> => {
  try {
    const orders = getAllOrders();
    const salesData: SalesData[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = orders.filter((order: Order) => {
        const orderDate = new Date(order.fecha_creacion).toISOString().split('T')[0];
        return orderDate === dateStr;
      });
      
      salesData.push({
        fecha: dateStr,
        ventas: dayOrders.length,
        ingresos: dayOrders.reduce((sum: number, order: Order) => sum + order.total, 0),
      });
    }
    
    return salesData;
  } catch (error) {
    console.error('Error al obtener ventas semanales:', error);
    return [];
  }
};

/**
 * Obtiene los productos más vendidos
 */
export const getTopProducts = async (limit: number = 5): Promise<TopProduct[]> => {
  try {
    const orders = getAllOrders();
    const productSales: Record<number, { nombre: string; ventas: number; ingresos: number }> = {};
    
    orders.forEach((order: Order) => {
      order.items.forEach((item: Order['items'][0]) => {
        if (!productSales[item.producto_id]) {
          productSales[item.producto_id] = {
            nombre: item.productName || 'Producto',
            ventas: 0,
            ingresos: 0,
          };
        }
        productSales[item.producto_id].ventas += item.cantidad;
        productSales[item.producto_id].ingresos += item.precio_unitario * item.cantidad;
      });
    });
    
    return Object.entries(productSales)
      .map(([id, data]) => ({
        id: Number(id),
        ...data,
      }))
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, limit);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    return [];
  }
};
