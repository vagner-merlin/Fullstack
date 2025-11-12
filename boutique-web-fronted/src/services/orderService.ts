// Service para pedidos - Conectado al backend Django

// Tipos de métodos de pago
export type PaymentMethodType = 'efectivo' | 'tarjeta' | 'qr';

export interface ShippingAddress {
  id?: number;
  direccion_completa: string;
  ciudad: string;
  codigo_postal?: string;
  telefono?: string;
  notas?: string;
}

// Constantes de métodos de pago
export const PAYMENT_METHODS = [
  {
    id: 'efectivo' as PaymentMethodType,
    name: 'Efectivo',
    description: 'Pago en efectivo contra entrega',
    icon: 'banknote'
  },
  {
    id: 'tarjeta' as PaymentMethodType,
    name: 'Tarjeta de Crédito/Débito',
    description: 'Pago seguro con tarjeta',
    icon: 'credit-card'
  },
  {
    id: 'qr' as PaymentMethodType,
    name: 'QR (Transferencia)',
    description: 'Pago por código QR',
    icon: 'smartphone'
  }
];

export interface OrderItem {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  talla?: string;
  color?: string;
}

export interface Order {
  id: number;
  numero_pedido: string;
  items: OrderItem[];
  direccion_envio: string;
  metodo_pago: string;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  subtotal: number;
  costo_envio: number;
  total: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface CreateOrderData {
  items: OrderItem[];
  direccion_envio: string;
  metodo_pago: string;
  subtotal: number;
  costo_envio: number;
  total: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const orderService = {
  // Crear nuevo pedido
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_URL}/api/pedidos/pedidos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Error al crear pedido');
    
    return response.json();
  },

  // Obtener pedidos del usuario
  getOrders: async (): Promise<Order[]> => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_URL}/api/pedidos/pedidos/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Error al obtener pedidos');
    
    return response.json();
  },

  // Obtener pedido por ID
  getOrderById: async (id: number): Promise<Order> => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_URL}/api/pedidos/pedidos/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Pedido no encontrado');
    
    return response.json();
  },

  // Cancelar pedido
  cancelOrder: async (id: number): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_URL}/api/pedidos/pedidos/${id}/cancelar/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('Error al cancelar pedido');
  },
};
