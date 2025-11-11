/**
 * Servicio de Punto de Venta (POS) para Vendedores
 */

import type { OrderItem, ShippingAddress } from '../orderService';

export interface PosSale {
  id: number;
  numero_venta: string;
  seller_id: number;
  seller_name: string;
  items: OrderItem[];
  subtotal: number;
  descuento_total: number;
  total: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'qr';
  estado: 'completado' | 'cancelado';
  cliente_nombre?: string;
  cliente_telefono?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePosSaleData {
  seller_id: number;
  seller_name: string;
  items: OrderItem[];
  subtotal: number;
  descuento_total: number;
  total: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'qr';
  cliente_nombre?: string;
  cliente_telefono?: string;
  notas?: string;
}

export interface DailySalesStats {
  total_ventas: number;
  total_ingresos: number;
  ventas_completadas: number;
  ventas_canceladas: number;
  venta_promedio: number;
  metodos_pago: {
    efectivo: number;
    tarjeta: number;
    qr: number;
  };
}

const STORAGE_KEY = 'boutique_pos_sales';

/**
 * Obtiene todas las ventas POS
 */
export const getAllSales = (): PosSale[] => {
  try {
    const salesStr = localStorage.getItem(STORAGE_KEY);
    return salesStr ? JSON.parse(salesStr) : [];
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    return [];
  }
};

/**
 * Guarda las ventas en localStorage
 */
const saveSales = (sales: PosSale[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  } catch (error) {
    console.error('Error al guardar ventas:', error);
  }
};

/**
 * Crea una nueva venta POS
 */
export const createSale = (data: CreatePosSaleData): PosSale => {
  const sales = getAllSales();
  
  const newSale: PosSale = {
    id: Date.now(),
    numero_venta: `POS-${Date.now().toString().slice(-8)}`,
    ...data,
    estado: 'completado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  sales.push(newSale);
  saveSales(sales);

  // También guardar como orden regular para que aparezca en el dashboard admin
  saveAsOrder(newSale);

  return newSale;
};

/**
 * Convierte venta POS a Order y la guarda
 */
const saveAsOrder = (sale: PosSale): void => {
  try {
    const ordersStr = localStorage.getItem('orders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];

    // Crear dirección de envío ficticia para venta en tienda
    const shippingAddress: ShippingAddress = {
      nombre_completo: sale.cliente_nombre || 'Venta en tienda',
      telefono: sale.cliente_telefono || 'N/A',
      direccion: 'Venta presencial',
      ciudad: 'Tienda física',
      departamento: 'Local',
      referencias: sale.notas || 'Venta registrada por vendedor',
    };

    const order = {
      id: sale.id,
      numero_pedido: sale.numero_venta,
      items: sale.items,
      direccion_envio: shippingAddress,
      metodo_pago: sale.metodo_pago === 'efectivo' ? 'efectivo' : sale.metodo_pago === 'tarjeta' ? 'tarjeta' : 'qr',
      estado: 'entregado', // Venta POS se considera entregada inmediatamente
      subtotal: sale.subtotal,
      costo_envio: 0, // Sin costo de envío para ventas presenciales
      total: sale.total,
      fecha_creacion: sale.created_at,
      fecha_actualizacion: sale.updated_at,
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error al guardar venta como orden:', error);
  }
};

/**
 * Obtiene ventas por vendedor
 */
export const getSalesBySeller = (sellerId: number): PosSale[] => {
  const sales = getAllSales();
  return sales.filter(sale => sale.seller_id === sellerId);
};

/**
 * Obtiene ventas de una fecha específica
 */
export const getSalesByDate = (date: Date): PosSale[] => {
  const sales = getAllSales();
  const targetDate = date.toISOString().split('T')[0];
  
  return sales.filter(sale => {
    const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
    return saleDate === targetDate;
  });
};

/**
 * Obtiene ventas del día actual
 */
export const getTodaySales = (): PosSale[] => {
  return getSalesByDate(new Date());
};

/**
 * Obtiene ventas del día actual por vendedor
 */
export const getTodaySellerSales = (sellerId: number): PosSale[] => {
  const todaySales = getTodaySales();
  return todaySales.filter(sale => sale.seller_id === sellerId);
};

/**
 * Obtiene estadísticas de ventas del día
 */
export const getDailySalesStats = (sellerId?: number): DailySalesStats => {
  const sales = sellerId ? getTodaySellerSales(sellerId) : getTodaySales();
  
  const completedSales = sales.filter(s => s.estado === 'completado');
  const cancelledSales = sales.filter(s => s.estado === 'cancelado');
  
  const totalIngresos = completedSales.reduce((sum, sale) => sum + sale.total, 0);
  
  const metodosPago = {
    efectivo: completedSales.filter(s => s.metodo_pago === 'efectivo').length,
    tarjeta: completedSales.filter(s => s.metodo_pago === 'tarjeta').length,
    qr: completedSales.filter(s => s.metodo_pago === 'qr').length,
  };

  return {
    total_ventas: sales.length,
    total_ingresos: totalIngresos,
    ventas_completadas: completedSales.length,
    ventas_canceladas: cancelledSales.length,
    venta_promedio: completedSales.length > 0 ? totalIngresos / completedSales.length : 0,
    metodos_pago: metodosPago,
  };
};

/**
 * Cancela una venta
 */
export const cancelSale = (saleId: number): void => {
  const sales = getAllSales();
  const saleIndex = sales.findIndex(s => s.id === saleId);
  
  if (saleIndex !== -1) {
    sales[saleIndex].estado = 'cancelado';
    sales[saleIndex].updated_at = new Date().toISOString();
    saveSales(sales);
  }
};

/**
 * Obtiene venta por ID
 */
export const getSaleById = (saleId: number): PosSale | null => {
  const sales = getAllSales();
  return sales.find(s => s.id === saleId) || null;
};

/**
 * Obtiene ventas de un rango de fechas
 */
export const getSalesByDateRange = (startDate: Date, endDate: Date): PosSale[] => {
  const sales = getAllSales();
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];
  
  return sales.filter(sale => {
    const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
    return saleDate >= start && saleDate <= end;
  });
};
